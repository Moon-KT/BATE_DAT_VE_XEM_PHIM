// Lấy ID phim từ URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

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
            fetchMovieShowtimes(movie.showtimeList);
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

// Hiển thị lịch chiếu
async function fetchMovieShowtimes(showtimeList) {
    const showtimeTabs = document.getElementById('showtime-tabs');
    const tabContent = document.getElementById('showtime-tab-content');

    const uniqueDays = [...new Set(showtimeList.map(showtime => showtime.startTime.split('T')[0]))];
    let isActive = 'active';

    for (const day of uniqueDays) {
        // Tạo tab cho ngày
        showtimeTabs.innerHTML += `
            <li class="${isActive}">
                <a href="#${day}" data-toggle="tab">${day}</a>
            </li>
        `;

        const dayShowtimes = showtimeList.filter(showtime => showtime.startTime.startsWith(day));
        let showtimeHtml = '';

        for (const showtime of dayShowtimes) {
            const roomName = await fetchRoomName(showtime.showtimeId);

            showtimeHtml += `
                <div class="col-lg-2 text-center">
                    <a class="btn btn-showtime" onclick="openBookingPopup('${roomName}', '${showtime.startTime}', ${showtime.emptySeats})">
                        ${new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </a>
                    <p>${showtime.emptySeats} ghế trống</p>
                </div>
            `;
        }

        // Tạo nội dung tab
        tabContent.innerHTML += `
            <div class="tab-pane ${isActive}" id="${day}">
                <div class="row">${showtimeHtml}</div>
            </div>
        `;
        isActive = '';
    }
}

// Hiển thị popup đặt vé
function openBookingPopup( startTime, emptySeats) {
    document.getElementById('ngaychieu').textContent = startTime.split('T')[0];
    document.getElementById('giochieu').textContent = startTime.split('T')[1];
    document.getElementById('datve-pop-up').style.display = 'block';
}

// Đóng popup
document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('datve-pop-up').style.display = 'none';
});

// Gọi API khi trang tải
if (movieId) {
    fetchMovieDetails();
} else {
    console.error('Không tìm thấy ID phim');
}
