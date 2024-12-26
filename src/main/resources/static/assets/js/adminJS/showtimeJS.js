// API giả lập
const apiShowtimes = `http://localhost:8080/api/showtimes/all`;
const apiCinemas = "http://localhost:8080/api/cinemas/1";
const apiMovies = "http://localhost:8080/api/cinemas/rooms/1/movies";



// Lấy 5 ngày gần nhất
function getNextFiveDays() {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]); // Định dạng YYYY-MM-DD
    }
    return dates;
}

// Hiển thị thanh ngày
function renderDateNav(dates) {
    const dateNav = document.getElementById("dateNav");
    dates.forEach((date, index) => {
        const button = document.createElement("button");
        button.className = `btn btn-${index === 0 ? "primary" : "outline-primary"} mx-1`;
        button.innerText = date;
        button.onclick = () => fetchMoviesByDate(date);
        dateNav.appendChild(button);
    });
}

// Lấy dữ liệu phim từ API
async function fetchMoviesByDate(date) {
    const response = await fetch(apiShowtimes);
    const data = await response.json();
    renderMovies(data.filter(showtime => showtime.startTime.startsWith(date)));
}

// Hiển thị danh sách phim
function renderMovies(showtimes) {
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = ""; // Xóa nội dung cũ
    const moviesGrouped = groupShowtimesByMovie(showtimes);

    Object.keys(moviesGrouped).forEach(movieId => {
        const movie = moviesGrouped[movieId][0].movie; // Thông tin phim
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        // HTML của mỗi phim
        card.innerHTML = `
                    <div class="card">
                        <img src="${movie.image}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">
                                <strong>Thể loại:</strong> ${movie.genre}<br>
                                <strong>Thời lượng:</strong> ${movie.duration} phút
                            </p>
                            <div class="d-flex flex-wrap">
                                ${moviesGrouped[movieId]
            .map(showtime => `
                                        <button class="btn btn-outline-secondary m-1" onclick="goToChooseSeat(${showtime.showId})">
                                            ${new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            (${showtime.seatsAvailable} ghế trống)
                                        </button>
                                    `).join("")}
                            </div>
                        </div>
                    </div>
                `;
        movieList.appendChild(card);
    });
}

// Nhóm suất chiếu theo phim
function groupShowtimesByMovie(showtimes) {
    return showtimes.reduce((acc, showtime) => {
        const movieId = showtime.movie.id;
        if (!acc[movieId]) acc[movieId] = [];
        acc[movieId].push(showtime);
        return acc;
    }, {});
}

// Chuyển đến trang chọn ghế
function goToChooseSeat(showId) {
    window.location.href = `/chonGhe.htm?showId=${showId}`;
}

// Chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    const dates = getNextFiveDays();
    renderDateNav(dates);
    fetchMoviesByDate(dates[0]); // Mặc định ngày đầu tiên
});