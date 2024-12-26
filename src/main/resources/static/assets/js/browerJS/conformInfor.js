const urlParams = new URLSearchParams(window.location.search);

const roomId = Number(urlParams.get('roomId'));
const movieId = Number(urlParams.get('movieId'));
const showtimeId = Number(urlParams.get('showtimeId'));
const cinemaId = Number(urlParams.get('cinemaId'));
const userId = Number(urlParams.get('userId'));
const seats = urlParams.get('seats');
const seatIds = urlParams.get('seatIds');
const timerDisplay = document.getElementById('timer');
let totalPrice = Number(urlParams.get('totalPrice'));
let currentPoints = 0; // Điểm beta hiện có
const conversionRate = 1; // 10 điểm = 1 nghìn đồng
let discount = 0; // Số tiền giảm
// Mảng tạm lưu số lượng
let comboQuantities = [
    id = 0,
    quantity = 0,
    price = 0
];
const selectedSeats = seats ? seats.split(',') : [];
const selectedSeatIds = seatIds ? seatIds.split(',') : [];
// Hàm để gọi API và cập nhật nội dung trang
async function loadMovieData() {
    try {
    // Fetch movie data
    const movieResponse = await fetch(`http://localhost:8080/api/movies/${movieId}`);
    const movieData = await movieResponse.json();

    // Fetch showtime data
    const showtimeResponse = await fetch(`http://localhost:8080/api/showtimes/${showtimeId}`);
    const showtimeData = await showtimeResponse.json();

    // Fetch cinema data
    const cinemaResponse = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`);
    const cinemaData = await cinemaResponse.json();

    // Fetch room data
    const roomResponse = await fetch(`http://localhost:8080/api/rooms/${roomId}`);
    const roomData = await roomResponse.json();

    // Update the page with the fetched data
    document.getElementById("movieTitle").textContent = movieData.movieName;

    if (movieData.genreList && movieData.genreList.length > 0) {
    const genres = movieData.genreList.map(genre => genre.genreName).join(", ");
    document.getElementById('movieGenre').innerHTML = `<strong>Thể loại:</strong> ${genres}`;
} else {
    document.getElementById('movieGenre').innerHTML = `<strong>Thể loại:</strong> Không rõ`;
}

    document.getElementById("movieDuration").textContent = `Thời lượng: ${movieData.movieDuration} phút`;
    document.getElementById("moviePoster").src = movieData.moviePoster;

    document.getElementById("cinemaName").textContent = `Rạp: ${cinemaData.cinemaName}`;

    // Chuyển đổi startTime từ chuỗi thành đối tượng Date
    const startTime = new Date(showtimeData.startTime);

    // Hiển thị ngày và giờ với định dạng "vi-VN"
    document.getElementById("showDate").textContent = `Ngày chiếu: ${startTime.toLocaleDateString("vi-VN")}`;
    document.getElementById("showTime").textContent = `Giờ chiếu: ${startTime.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`;

    document.getElementById("screenRoom").textContent = `Phòng chiếu: ${roomData.roomName}`;
    document.getElementById("selectedSeats").textContent = selectedSeats.length;

} catch (error) {
    console.error("Error fetching data:", error);
}
}
// Hàm để gọi API và cập nhật thông tin thanh toán
function fetchPaymentDetails() {
    fetch(`http://localhost:8080/api/users/${userId}`)  // Giả sử API trả về thông tin thanh toán
        .then(response => response.json())
        .then(data => {
            console.log('Thông tin thanh toán:', data);
            // Cập nhật các phần tử HTML với dữ liệu trả về từ API
            document.getElementById('fullName').textContent = data.username;
            document.getElementById('phoneNumber').textContent = data.phone;
            document.getElementById('email').textContent = data.email;
            document.getElementById('seatInfo').textContent = selectedSeats.join(', ');
            document.getElementById('totalSeatPrice').textContent = totalPrice;
            document.getElementById('currentPoints').textContent = data.accPoint;
        })
        .catch(error => {
            console.error('Có lỗi xảy ra khi lấy thông tin thanh toán:', error);
        });
}
// Hàm renderCombos
async function renderCombos() {
    const comboList = document.getElementById("comboList");
    comboList.innerHTML = "";
     // Gọi API lấy danh sách combo
        const response = await fetch("http://localhost:8080/api/combos/all");
        const combos = await response.json();

        // Khởi tạo số lượng và giá cho mỗi combo
        comboQuantities = combos.map((combo) => ({
            id: combo.comboId,
            quantity: 0,
            price: combo.price, // Giá của combo
        }));

        // Tạo giao diện cho từng combo
        combos.forEach((combo) => {
            const comboItem = document.createElement("div");
            comboItem.className = "combo-item";
            comboItem.innerHTML = `
        <div class="d-flex align-items-center mb-3 border-bottom pb-2">
          <!-- Hình ảnh Combo -->
          <div class="col-2">
            <img src="${combo.imageCombo}" alt="${combo.comboName}" class="combo-image rounded"
              style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;">
          </div>

          <!-- Tên Combo -->
          <div class="col-3">
            <p class="mb-0">${combo.comboName}</p>
          </div>

          <!-- Mô tả Combo -->
          <div class="col-5">
            <p class="mb-0 text-muted">${combo.comboDescription}</p>
          </div>

          <!-- Số lượng Combo -->
          <div class="col-2 d-flex align-items-center justify-content-center">
            <button class="btn btn-outline-primary btn-sm" onclick="updateCombo(${combo.comboId}, -1)"
              style="width: 30px; height: 30px;">-</button>
            <span id="combo${combo.comboId}Quantity" class="mx-2 fw-bold">0</span>
            <button class="btn btn-outline-primary btn-sm" onclick="updateCombo(${combo.comboId}, 1)"
              style="width: 30px; height: 30px;">+</button>
          </div>
        </div>
      `;
            comboList.appendChild(comboItem);
        });

        updateTotal();
}

async function updateCombo(id, change) {
    // Tìm combo trong mảng tạm
    const combo = comboQuantities.find((c) => c.id === id);

    if (combo) {
        const newQuantity = combo.quantity + change;

        comboQuantities.quantity = newQuantity;
        // Chỉ cập nhật nếu số lượng mới không âm
        if (newQuantity >= 0) {
            combo.quantity = newQuantity;

            // Cập nhật giao diện
            document.getElementById(`combo${id}Quantity`).textContent = newQuantity;

            // Gọi hàm cập nhật tổng tiền
            updateTotal();
        }
    }
}
// Hàm kiểm tra ngày nằm trong tuần
function isInWeek(date) {
    const today = new Date();
    const timeDifference = today - date; // tính khoảng cách thời gian
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 1 tuần tính bằng milliseconds
    return timeDifference <= oneWeekInMs;
}
// Hàm xử lý khi hiển thị thông tin chương trình và quy đổi
async function applyPromoCode() {
    const showTime = {
    startTime: '2024-12-05T15:00:00',  // Ví dụ về giờ chiếu
};
    const user = {
    createTime: '2024-11-30T10:00:00',  // Ví dụ về thời gian đăng ký của người dùng
};

    const programNameElement = document.getElementById('programName');
    const promoDetailsElement = document.getElementById('promoDetails');

    // Kiểm tra ngày của showtime có phải T3 hoặc T6 không
    const showDate = new Date(showTime.startTime);
    const dayOfWeek = showDate.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7

    if (dayOfWeek === 2 || dayOfWeek === 5) { // T3 là thứ 3, T6 là thứ 6
    programNameElement.textContent = 'Giảm giá 10% - Voucher';
    promoDetailsElement.textContent = 'Giảm 10% cho vé đặt trong các ngày T3 và T6';

    discount = totalPrice * 0.9; // Giảm giá 10%
        updateTotal();
}

    // Kiểm tra nếu thời gian đăng ký của người dùng trong 1 tuần, thì trừ 30k
    const response = await fetch(`http://localhost:8080/api/users/${userId}`);
    const userP = await response.json();
    currentPoints = userP.accPoint; // Điểm beta hiện có

    const userCreateDate = new Date(user.createAt); // Truy cập giá trị createAt
    if (isInWeek(userCreateDate)) {
    programNameElement.textContent += ' | Giảm thêm 30k cho người dùng mới';
    promoDetailsElement.textContent += ' | Giảm thêm 30k cho người dùng đăng ký trong vòng 1 tuần';
    discount = 30000;
}
    updateTotal()
}

// Hàm cập nhật tổng tiền
function updateTotal() {
    // Tính tổng giá ghế
    const totalSeatPrice = totalPrice;

    // Tính tổng giá combo
    const totalComboPrice = comboQuantities.reduce(
        (sum, combo) => sum + combo.quantity * combo.price,
        0
    );

    // Tính tổng tiền cuối cùng
    const finalTotal = totalSeatPrice + totalComboPrice - discount;

    // Hiển thị lên giao diện
    document.getElementById("totalSeatPrice").textContent = `${totalSeatPrice.toLocaleString()} VND`;
    document.getElementById("finalTotal").textContent = `${finalTotal.toLocaleString()} VND`;
}


// Toggle hiển thị chi tiết beta points
document.getElementById("betaPointsToggle").addEventListener("click", () => {
    const details = document.getElementById("betaPointsDetails");
    details.classList.toggle("hidden");
});
async function convertPoints() {
    const pointsInput = parseInt(document.getElementById("pointsInput").value);
    const errorMessage = document.getElementById("errorMessage");
    const resultMessage = document.getElementById("resultMessage");
    const appliedDiscount = document.getElementById("appliedDiscount");
    const totalPriceElement = document.getElementById("finalTotal");

    // Ẩn lỗi và kết quả cũ
    errorMessage.classList.add("hidden");
    resultMessage.classList.add("hidden");
    appliedDiscount.classList.add("hidden");

    if (isNaN(pointsInput) || pointsInput <= 0) {
    errorMessage.textContent = "Vui lòng nhập số điểm hợp lệ.";
    errorMessage.classList.remove("hidden");
    return;
}

    if (pointsInput > currentPoints) {
    errorMessage.textContent = "Số điểm nhập vượt quá số điểm hiện có.";
    errorMessage.classList.remove("hidden");
    return;
}

    // Tính số tiền giảm (10 điểm = 1 nghìn đồng)
    const money = Math.floor(pointsInput / 10) * conversionRate;

    // Cập nhật số điểm và tổng tiền
    currentPoints -= pointsInput;
    totalPrice -= money;

    // Hiển thị kết quả
    resultMessage.textContent = `Bạn đã sử dụng ${pointsInput} điểm.`;
    resultMessage.classList.remove("hidden");
    appliedDiscount.textContent = `Số tiền giảm: ${money.toLocaleString()} VNĐ`;
    appliedDiscount.classList.remove("hidden");
    totalPriceElement.textContent = totalPrice.toLocaleString();

    // Cập nhật điểm còn lại
    document.getElementById("currentPoints").textContent = currentPoints;
}

let totalTime = Number(urlParams.get('timerDisplay'));
// Hàm cập nhật bộ đếm ngược
function updateTimer() {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    console.log(minutes, seconds);


    // Hiển thị thời gian ở định dạng MM:SS
    document.getElementById('time').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Giảm thời gian
    totalTime--;

    // Khi thời gian về 0, chuyển hướng sang trang gui.html
    if (totalTime < 0) {
    clearInterval(timerInterval);
    window.location.href = "GuiBetaCinema.html"; // Chuyển hướng
}
}

// Thiết lập interval để gọi hàm mỗi giây
    const timerInterval = setInterval(updateTimer, totalTime);

// Gọi hàm ngay khi trang tải để cập nhật lần đầu
    updateTimer();
    // Gọi hàm để kiểm tra khi trang được tải
    window.onload = applyPromoCode;
    // Gọi hàm khi trang web tải
    fetchPaymentDetails();
    // Gọi hàm loadCombos khi trang được tải
    renderCombos();
// Gọi hàm khi trang được tải xong
document.addEventListener('DOMContentLoaded', loadMovieData);

document.getElementById("btnThanhtoan").addEventListener("click", () => {

    window.location.href = `/payment.htm?roomId=${roomId}&movieId=${movieId}&showtimeId=${showtimeId}&cinemaId=${cinemaId}&userId=${userId}&totalPrice=${totalPrice}&seats=${selectedSeats.join(',')}&seatIds=${selectedSeatIds.join(',')}&comboQuantities=${encodeURIComponent(JSON.stringify(comboQuantities))}`;
});
    <!-- ================================ quay lại trang chọn ghế ============================ -->
    document.getElementById("backseat").addEventListener("click", () => {

        window.location.href = `/chonGhe.htm?roomId=${roomId}&movieId=${movieId}&showtimeId=${showtimeId}&cinemaId=${cinemaIdF}&userId=${userId}`;
});
