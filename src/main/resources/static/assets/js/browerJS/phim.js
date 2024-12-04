// Hàm gọi API và hiển thị phim

let cinemaNameNow = "Beta Thanh Xuân"


async function fetchMovies() {
    try {
        let cinemaId = getQueryParam("cinemaId");
        if(!cinemaId) {
            cinemaId = 1;
        }
        const apiUrl = `http://localhost:8080/api/cinemas/${cinemaId}/movies`;
        const response = await fetch(apiUrl);
        console.log('response:', response);
        const movies = await response.json(); // Danh sách phim

        await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`)
            .then(response => response.json())
            .then(data => {
                let cinenaNameModal = document.getElementById('cinemaNameModal');
                cinemaNameNow = data.cinemaName;
                cinenaNameModal.textContent = cinemaNameNow;
                // console.log('Tên rạp:', cinemaNameNow);
            });

        console.log('Danh sách phim:', movies);
        // Lấy ngày hiện tại
        const now = new Date();

        // Phân loại phim
        const nowShowing = movies.filter(movie =>
            new Date(movie.movieReleaseDate) <= now
        );
        const upcoming = movies.filter(movie =>
            new Date(movie.movieReleaseDate) > now
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
    const embedUrl = trailerUrl.includes("watch?v=")
        ? trailerUrl.replace("watch?v=", "embed/")
        : trailerUrl;

    const trailerIframe = document.getElementById('trailerVideo');
    trailerIframe.src = embedUrl;

    const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
    trailerModal.show();

    const modalElement = document.getElementById('trailerModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
        trailerIframe.src = '';
    });
}

// Hiển thị lịch chiếu
function handleShowSchedule(button) {
    const showtimeList = JSON.parse(button.getAttribute('data-showtime-list')); // Chắc chắn dữ liệu là JSON hợp lệ
    const movieName = button.getAttribute('data-movie-name');  // Lấy tên phim từ attribute của button
    showSchedule(movieName, showtimeList); // Gọi hàm hiển thị lịch chiếu

    // Mở modal sau khi chuẩn bị dữ liệu
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    scheduleModal.show();
}

// function toggleBuyTicketButton(showtimeList) {
//     const buyTicketButton = document.getElementById('buyTicketButton');
//     const today = new Date();
//
//     // Kiểm tra xem có lịch chiếu sau ngày hôm nay không
//     const hasShowtime = showtimeList.some(showtime => {
//         const showtimeDate = new Date(showtime.startTime);
//         return showtimeDate >= today;
//     });
//
//     // Hiển thị hoặc ẩn nút "Mua vé"
//     buyTicketButton.style.display = hasShowtime ? 'block' : 'none';
// }

// Hàm để hiển thị modal với lịch chiếu
function showSchedule(movieName, showtimeList) {
    const scheduleDateBar = document.getElementById('scheduleDateBar');
    const showtimeContainer = document.getElementById('showtimeContainer');
    const movieNameElement = document.getElementById('movieName');

    movieNameElement.innerText = movieName;

    // Lọc các ngày trong vòng 5 ngày kể từ hôm nay
    const today = new Date();
    const days = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        days.push(day);
    }

    scheduleDateBar.innerHTML = ''; // Xóa nội dung cũ
    days.forEach(day => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary mx-1';
        button.innerText = `${day.getDate()}/${day.getMonth() + 1} - ${day.toLocaleString('default', { weekday: 'short' })}`;
        button.addEventListener('click', () => showShowtimesForDate(day, showtimeList));
        scheduleDateBar.appendChild(button);
    });

    function showShowtimesForDate(date, showtimeList) {
        showtimeContainer.innerHTML = ''; // Xóa nội dung cũ
        const filteredShowtimes = showtimeList.filter(showtime => {
            const showtimeDate = new Date(showtime.startTime);
            return showtimeDate.toDateString() === date.toDateString();
        });

        filteredShowtimes.forEach(showtime => {
            const showtimeDiv = document.createElement('div');
            showtimeDiv.className = 'd-flex justify-content-between mb-2 p-3 border rounded';

            const showtimeElement = document.createElement('span');
            showtimeElement.setAttribute("data-bs-toggle", "modal");
            showtimeElement.setAttribute("data-bs-target", "#bookingModal");
            showtimeElement.innerText = new Date(showtime.startTime).toLocaleTimeString();
            showtimeElement.style.cursor = 'pointer';  // Make it clickable

            // Kiểm tra console xem showtime có được tạo đúng không
            console.log('Showtime:', showtime);

            showtimeElement.addEventListener('click', () => {
                console.log('Clicked on showtime element');
                openBookingModal(showtime, cinemaNameNow, date);
            });

            showtimeDiv.appendChild(showtimeElement);

            // Tạo span cho số ghế trống
            const emptySeatsSpan = document.createElement('span');
            emptySeatsSpan.innerText = `Số ghế trống: ${showtime.emptySeats}`;
            showtimeDiv.appendChild(emptySeatsSpan);

            showtimeContainer.appendChild(showtimeDiv);
        });
    }

// Hàm mở modal khi chọn giờ chiếu
    function openBookingModal(showtime, cinemaName, date) {
        // Đóng scheduleModal nếu đang mở
        const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
        scheduleModal.hide();

        // Lấy các phần tử trong modal
        const cinemaNameModal = document.getElementById('cinemaNameModal');
        const showDateModal = document.getElementById('showDateModal');
        const showTimeModal = document.getElementById('showTimeModal');

        // // Kiểm tra các phần tử trong modal có đúng không
        // console.log(cinemaNameModal);
        // console.log(showDateModal);
        // console.log(showTimeModal);

        // Cập nhật thông tin vào modal
        cinemaNameModal.innerText = cinemaName;
        showDateModal.innerText = date.toLocaleDateString();
        showTimeModal.innerText = new Date(showtime.startTime).toLocaleTimeString();

        // Mở modal booking
        const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
        bookingModal.show();

        // Thêm sự kiện cho nút "Đồng ý"
        document.getElementById('confirmBookingBtn').addEventListener('click', () => {
            console.log('Confirmed booking for:', cinemaName, date, showtime.startTime);
            bookingModal.hide();  // Đóng modal sau khi xác nhận
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
                            data-showtime-list='${JSON.stringify(movie.showtimeList)}' 
                            data-movie-name="${movie.movieName}">
                            Mua vé
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += movieCard;
    });
}

const modalElement = document.getElementById('scheduleModal');
modalElement.addEventListener('hidden.bs.modal', () => {
    // Reset các giá trị hoặc hành động sau khi đóng modal
    // Ví dụ, bạn có thể reset lại nội dung hiển thị trong modal nếu cần thiết
});

// Lấy ra param cinemaId từ URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Gọi hàm để tải phim khi trang được load
window.onload = fetchMovies;
