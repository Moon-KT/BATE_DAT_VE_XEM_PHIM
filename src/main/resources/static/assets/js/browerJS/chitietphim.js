// Lấy ID phim từ URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const cinemaId = urlParams.get('cinemaId');
const cinemaName = urlParams.get('cinemaName');

// URL API
const apiMovieUrl = `http://localhost:8080/api/movies/${movieId}`;
const apiRoomUrl = `http://localhost:8080/api/showtimes/room/`;

// Gọi API và hiển thị chi tiết phim
async function fetchMovieDetails() {
    try {
        const response = await fetch(apiMovieUrl);
        if (!response.ok) throw new Error('Không thể tải chi tiết phim');

        const movie = await response.json();
        displayMovieDetails(movie);
        updateBreadcrumb(movie.movieName);

        if (movie.showtimeList) {
            showSchedule(movie.movieName, movie.showtimeList);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        document.getElementById('movie-details').innerHTML = `<p class="text-danger">Lỗi khi tải chi tiết phim.</p>`;
    }
}

// Hiển thị chi tiết phim
function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movie-details');
    const genres = movie.genreList.map(genre => `<span class="badge">${genre.genreName}</span>`).join(' ');

    movieDetails.innerHTML = `
        <div class="col-md-4">
            <img src="${movie.moviePoster}" alt="${movie.movieName}" class="movie-poster">
        </div>
        <div class="col-md-8">
            <h1>${movie.movieName}</h1>
            <p><strong>Mô tả:</strong> ${movie.movieDescription}</p>
            <p><strong>Đạo diễn:</strong> ${movie.movieDirector}</p>
            <p><strong>Diễn viên:</strong> ${movie.movieActor}</p>
            <p><strong>Thể loại:</strong> ${genres}</p>
            <p><strong>Thời lượng:</strong> ${movie.movieDuration} phút</p>
            <p><strong>Ngày khởi chiếu:</strong> ${movie.movieReleaseDate}</p>
        </div>
    `;
}

// Cập nhật breadcrumb
function updateBreadcrumb(movieName) {
    document.getElementById('movie-name').textContent = movieName;
}

// Lấy thông tin phòng chiếu từ API
async function fetchRoomName(showtimeId) {
    try {
        const response = await fetch(`${apiRoomUrl}${showtimeId}`);
        if (!response.ok) throw new Error('Không thể lấy tên phòng chiếu');
        const roomName = await response.text();
        return roomName;
    } catch (error) {
        console.error('Lỗi:', error);
        return 'Phòng không xác định';
    }
}
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
        button.innerText = `${day.getDate()}/${day.getMonth() + 1} - ${day.toLocaleString('default', {weekday: 'short'})}`;
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
            showtimeElement.innerText = new Date(showtime.startTime).toLocaleTimeString();
            showtimeElement.style.cursor = 'pointer';  // Make it clickable

            // Khi nhấn vào giờ chiếu, mở form đặt vé
            showtimeElement.addEventListener('click', () => {
                openBookingForm(showtime, cinemaName, date, movieName);
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
    function openBookingForm(showtime, cinemaName, date, movieName) {
        // Lấy các phần tử trong modal
        const movieNameModal = document.getElementById('movieNameModal');
        const cinemaNameModal = document.getElementById('cinemaNameModal');
        const showDateModal = document.getElementById('showDateModal');
        const showTimeModal = document.getElementById('showTimeModal');

        // Cập nhật thông tin vào modal
        movieNameModal.innerText = movieName;
        cinemaNameModal.innerText = cinemaName;
        showDateModal.innerText = date.toLocaleDateString();
        showTimeModal.innerText = new Date(showtime.startTime).toLocaleTimeString();

        // Mở modal booking
        const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
        bookingModal.show();

        // Thêm sự kiện cho nút "Đồng ý"
        document.getElementById('confirmBookingBtn').addEventListener('click', () => {
            bookingModal.hide();  // Đóng modal sau khi xác nhận

            window.location.href = `/chonGhe.htm?roomId=${showtime.roomId}&movieId=${showtime.movieId}&showtimeId=${showtime.showtimeId}&cinemaId=${cinemaId}`;
        });
    }
}

// Gọi API khi trang tải
if (movieId) {
    fetchMovieDetails();
} else {
    console.error('Không tìm thấy ID phim');
}
