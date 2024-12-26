const urlParams = new URLSearchParams(window.location.search);

const roomId = urlParams.get('roomId');
const movieId = urlParams.get('movieId');
const showtimeId = urlParams.get('showtimeId');
const cinemaId = urlParams.get('cinemaId');
const userId = urlParams.get('userId');

const roomIdLong = Number(roomId);
const movieIdLong = Number(movieId);
const showtimeIdLong = Number(showtimeId);
const cinemaIdLong = Number(cinemaId);

// Biến lưu tổng tiền
let totalPrice = 0;

// Mảng lưu các ghế đã chọn
let selectedSeats = [];

// Mảng lưu id của các ghế đã chọn
let selectedSeatIds = [];

// Hàm chuyển trạng thái ghế (chọn, bỏ chọn)
function toggleSeat(seatElement, seat) {
    const seatName = seat.seatRow + seat.seatNumber;

    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        seatElement.style.backgroundImage = `url('${seatElement.dataset.availableImage}')`;
        totalPrice -= seat.seatPrice; // Giảm tổng tiền

        // Xóa tên ghế khỏi danh sách đã chọn
        selectedSeats = selectedSeats.filter(s => s !== seatName);
    } else if (seatElement.classList.contains('available')) {
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        seatElement.style.backgroundImage = `url('${seatElement.dataset.selectedImage}')`;
        totalPrice += seat.seatPrice; // Tăng tổng tiền

        // Thêm tên ghế vào danh sách đã chọn
        selectedSeats.push(seatName);

        // Thêm id ghế vào danh sách đã chọn
        selectedSeatIds.push(seat.seatId);
    } else {
        seatElement.classList.remove('selected');
        seatElement.classList.add('booked');
        seatElement.style.backgroundImage = `url('${seatElement.dataset.bookedImage}')`;
    }

    // Cập nhật danh sách ghế đã chọn hiển thị
    updateSelectedSeats();

    // Cập nhật tổng tiền hiển thị
    document.getElementById('total-price').textContent = totalPrice.toLocaleString();
}

// Hàm cập nhật danh sách ghế đã chọn hiển thị
function updateSelectedSeats() {
    const seatNamesElement = $('#seatNames');
    if (selectedSeats.length > 0) {
        seatNamesElement.html(`<strong>Ghế ngồi:</strong> ${selectedSeats.join(', ')}`);
    } else {
        seatNamesElement.html(`<strong>Ghế ngồi:</strong> Chưa chọn`);
    }
}
// Hàm tạo sơ đồ ghế từ API
function generateSeatMap() {
    const seatMapContainer = document.getElementById('seat-map');

    fetch(`http://localhost:8080/api/seats/room/${roomIdLong}/seats`)
        .then(response => response.json())
        .then(data => {
            const seatRows = {};

            data.forEach(seat => {
                if (!seatRows[seat.seatRow]) {
                    seatRows[seat.seatRow] = [];
                }
                seatRows[seat.seatRow].push(seat);
            });

            Object.keys(seatRows).forEach(row => {
                const rowSeatsContainer = document.createElement('div');
                rowSeatsContainer.classList.add('row');

                seatRows[row].forEach(seat => {
                    let availableImage, selectedImage, bookedImage, width, height;

                    switch (seat.seatTypeId) {
                        case 1:
                            availableImage = 'assets/img/seat-unselect-normal.png';
                            selectedImage = 'assets/img/seat-select-normal.png';
                            bookedImage = 'assets/img/seat-buy-normal.png';
                            width = '50px';
                            height = '50px';
                            break;
                        case 2:
                            availableImage = 'assets/img/seat-unselect-vip.png';
                            selectedImage = 'assets/img/seat-select-vip.png';
                            bookedImage = 'assets/img/seat-buy-vip.png';
                            width = '50px';
                            height = '50px';
                            break;
                        case 3:
                            availableImage = 'assets/img/seat-unselect-double.png';
                            selectedImage = 'assets/img/seat-select-double.png';
                            bookedImage = 'assets/img/seat-buy-double.png';
                            width = '120px';
                            height = '50px';
                            break;
                        default:
                            availableImage = 'assets/img/seat-regular-available.png';
                            selectedImage = 'assets/img/seat-regular-selected.png';
                            bookedImage = 'assets/img/seat-regular-booked.png';
                    }

                    const seatElement = document.createElement('button');
                    seatElement.classList.add('btn', 'm-2', 'p-0');
                    seatElement.classList.add(seat.seatStatus === 'Available' ? 'available' : seat.seatStatus === 'Booked' ? 'booked' : 'selected');
                    seatElement.style.backgroundImage = `url(${seat.seatStatus === 'Available' ? availableImage : seat.seatStatus === 'Booked' ? bookedImage : selectedImage})`;
                    seatElement.style.backgroundSize = 'cover';
                    seatElement.style.width = width;
                    seatElement.style.height = height;
                    seatElement.textContent = `${seat.seatRow}${seat.seatNumber}`;
                    seatElement.dataset.availableImage = availableImage;
                    seatElement.dataset.selectedImage = selectedImage;
                    seatElement.dataset.bookedImage = bookedImage;

                    seatElement.addEventListener('click', () => toggleSeat(seatElement, seat));

                    const colElement = document.createElement('div');
                    colElement.classList.add('col');
                    colElement.appendChild(seatElement);

                    rowSeatsContainer.appendChild(colElement);
                });

                seatMapContainer.appendChild(rowSeatsContainer);
            });
        });
}

// Hàm lấy thông tin phim từ API
async function getMovieInfo() {
    const apiUrl = `http://localhost:8080/api/movies/${movieIdLong}`;
    const apiRoomUrl = `http://localhost:8080/api/rooms/${roomIdLong}`;
    const apiCinemaUrl = `http://localhost:8080/api/cinemas/${cinemaIdLong}`;

    try {
        const [roomResponse, cinemaResponse, movieResponse] = await Promise.all([
            fetch(apiRoomUrl),
            fetch(apiCinemaUrl),
            fetch(apiUrl)
        ]);

        const room = await roomResponse.json();
        const cinema = await cinemaResponse.json();
        const movie = await movieResponse.json();

        document.getElementById('moviePoster').src =  (movie.moviePoster || "https://via.placeholder.com/300x400");
        document.getElementById('movieTitle').textContent = movie.movieName || "Không rõ tên phim";
        document.getElementById('cinemaName').innerHTML = `<strong>Rạp chiếu:</strong> ${cinema.cinemaName || "Không rõ rạp"}`;
        document.getElementById('movieRoom').innerHTML = `<strong>Phòng:</strong> ${room.roomName || "Không rõ"}`;

        if (movie.genreList && movie.genreList.length > 0) {
            const genres = movie.genreList.map(genre => genre.genreName).join(", ");
            document.getElementById('movieGenres').innerHTML = `<strong>Thể loại:</strong> ${genres}`;
        } else {
            document.getElementById('movieGenres').innerHTML = `<strong>Thể loại:</strong> Không rõ`;
        }

        document.getElementById('duration').innerHTML = `<strong>Thời lượng:</strong> ${movie.movieDuration || "Không rõ thời lượng"}`;

        const showtime = movie.showtimeList && movie.showtimeList[0];
        if (showtime) {
            const startTime = new Date(showtime.startTime);
            document.getElementById('dateShow').innerHTML = `<strong>Ngày chiếu:</strong> ${startTime.toLocaleDateString("vi-VN")}`;
            document.getElementById('timeShow').innerHTML = `<strong>Giờ chiếu:</strong> ${startTime.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Cập nhật tên phim vào trong breadcrumb
        document.getElementById('movie-name').textContent = movie.movieName;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin phim:", error);
    }
}

// Hàm đặt ghế
document.getElementById('btnContinue').addEventListener('click', function () {
    window.location.href = `conform.htm?userId=${userId}&roomId=${roomId}&movieId=${movieId}&showtimeId=${showtimeId}&cinemaId=${cinemaId}&seats=${selectedSeats.join(',')}&seatIds=${selectedSeatIds.join(',')}&totalPrice=${totalPrice}&timerDisplay=${timer}`;
});

// Hủy đặt ghế
document.getElementById('cancel-booking').addEventListener('click', function () {
    window.location.href = `home.htm?userId=${userId}`;
});

let timer = parseInt(localStorage.getItem('timer')) || 600;  // Ví dụ: 600 giây (10 phút) mặc định
const timerDisplay = document.getElementById('timer');  // Sử dụng ID 'timer' trong HTML để hiển thị thời gian

// Kiểm tra nếu phần tử 'timer' tồn tại trong DOM
if (timerDisplay) {
    function updateTimer() {
        const minutes = Math.floor(timer / 60);  // Tính phút
        const seconds = timer % 60;  // Tính giây
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;  // Cập nhật nội dung phần tử

        // Nếu hết thời gian, điều hướng về trang home
        if (timer <= 0) {
            window.location.href = `home.htm?userId=${userId}`;  // Quay về trang home nếu hết thời gian
        } else {
            timer--;  // Giảm timer mỗi giây
            localStorage.setItem('timer', timer);  // Lưu giá trị timer vào localStorage
        }
    }

    // Cập nhật đồng hồ mỗi giây
    setInterval(updateTimer, 1000);
} else {
    console.log('Không tìm thấy phần tử với ID "timer".');
}


// Tạo sơ đồ ghế khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    generateSeatMap();
    getMovieInfo();
});
