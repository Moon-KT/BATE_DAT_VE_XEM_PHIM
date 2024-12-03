// API trả về danh sách các phim
const apiUrl = 'http://localhost:8080/api/movies/all';

// Hàm gọi API và hiển thị phim
async function fetchMovies() {
    try {
        const response = await fetch(apiUrl);
        const movies = await response.json(); // Danh sách phim

        // Lấy ngày hiện tại
        const now = new Date();

        // Phân loại phim
        const nowShowing = movies.filter(movie =>
            movie.showtimeList.some(showtime => new Date(showtime.startTime) <= now)
        );
        const upcoming = movies.filter(movie =>
            movie.showtimeList.every(showtime => new Date(showtime.startTime) > now)
        );

        // Hiển thị phim theo từng nhóm
        renderMovies('now-showing-movies', nowShowing);
        renderMovies('upcoming-movies', upcoming);
    } catch (error) {
        console.error('Lỗi khi tải danh sách phim:', error);
    }
}

// Hiển thị trailer
function showTrailer(trailerUrl) {
    // Chuyển đổi URL nếu cần
    const embedUrl = trailerUrl.includes("watch?v=")
        ? trailerUrl.replace("watch?v=", "embed/")
        : trailerUrl;

    // Gán URL cho iframe
    const trailerIframe = document.getElementById('trailerVideo');
    trailerIframe.src = embedUrl;

    // Hiển thị modal
    const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
    trailerModal.show();

    // Xóa URL khi modal đóng (để dừng video)
    const modalElement = document.getElementById('trailerModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
        trailerIframe.src = '';
    });
}

// Hiển thị lịch chiếu
function handleShowSchedule(button) {
    // Lấy dữ liệu showtimeList từ thuộc tính 'data-showtime-list' của button
    const showtimeList = JSON.parse(button.getAttribute('data-showtime-list'));

    // Lấy tên phim từ thuộc tính data-movie-name (có thể thêm vào HTML nếu cần)
    const movieName = button.getAttribute('data-movie-name');

    // Gọi hàm showSchedule để hiển thị lịch chiếu
    showSchedule(showtimeList, movieName);
}

function toggleBuyTicketButton(showtimeList) {
    const buyTicketButton = document.getElementById('buyTicketButton');
    const today = new Date();

    // Kiểm tra xem có lịch chiếu sau ngày hôm nay không
    const hasShowtime = showtimeList.some(showtime => {
        const showtimeDate = new Date(showtime.startTime);
        return showtimeDate >= today;
    });

    // Ẩn hoặc hiển thị nút
    if (hasShowtime) {
        buyTicketButton.style.display = 'block'; // Hiển thị nút
    } else {
        buyTicketButton.style.display = 'none'; // Ẩn nút
    }
}


function showSchedule(movieName, showtimeList) {
    const scheduleDateBar = document.getElementById('scheduleDateBar');
    const showtimeContainer = document.getElementById('showtimeContainer');
    const movieNameElement = document.getElementById('movieName');

    movieNameElement.innerText = movieName;

    // Lọc lịch chiếu trong vòng 5 ngày
    const today = new Date();
    const days = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        days.push(day);
    }

    // Hiển thị các ngày lên thanh ngang
    scheduleDateBar.innerHTML = '';
    days.forEach(day => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary mx-1';
        button.innerText = `${day.getDate()}/${day.getMonth() + 1} - ${day.toLocaleString('default', { weekday: 'short' })}`;
        button.addEventListener('click', () => showShowtimesForDate(day, showtimeList));
        scheduleDateBar.appendChild(button);
    });

    // Chức năng hiển thị giờ chiếu theo ngày
    function showShowtimesForDate(date, showtimeList) {
        showtimeContainer.innerHTML = '';
        const filteredShowtimes = showtimeList.filter(showtime => {
            const showtimeDate = new Date(showtime.startTime);
            return showtimeDate.toDateString() === date.toDateString();
        });

        filteredShowtimes.forEach(showtime => {
            const showtimeDiv = document.createElement('div');
            showtimeDiv.className = 'd-flex justify-content-between mb-2 p-3 border rounded';
            showtimeDiv.innerHTML = `
                <span>${new Date(showtime.startTime).toLocaleTimeString()}</span>
                <span>Số ghế trống: ${showtime.emptySeats}</span>
            `;
            showtimeContainer.appendChild(showtimeDiv);
        });
    }
}

function renderMovies(containerId, movies) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Xóa nội dung cũ

    if (movies.length === 0) {
        container.innerHTML = '<p>Không có phim nào trong mục này.</p>';
        return;
    }

    movies.forEach(movie => {
        const genres = movie.genreList.map(genre => `<span class="badge bg-secondary me-1">${genre.genreName}</span>`).join('');
        const movieCard = `
            <div class="col-md-3 mb-4">
                <div class="card">
                    <img src="${movie.moviePoster}" class="card-img-top" alt="${movie.movieName}" style="cursor: pointer;" onclick="showTrailer('${movie.movieTrailer}')">
                    <div class="card-body">
                        <h5 class="card-title">
                            <a href="/chitietphim.htm?id=${movie.movieId}" class="text-decoration-none">${movie.movieName}</a>
                        </h5>
                        <p class="card-text">Thể loại: ${genres}</p>
                        <p class="card-text">Thời lượng: ${movie.movieDuration} phút</p>
                        <button 
                            class="btn btn-primary mx-auto d-block" 
                            onclick="handleShowSchedule(this)" 
                            data-showtime-list='${JSON.stringify(movie.showtimeList)}'>
                            Mua vé
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += movieCard;
    });
}

// Gọi hàm để tải phim khi trang được load
window.onload = fetchMovies;


