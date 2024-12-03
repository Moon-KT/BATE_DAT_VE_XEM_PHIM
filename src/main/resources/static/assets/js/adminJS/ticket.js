let bookingChart, ticketsPerMovieChart;

function fetchBookingData() {
    fetch('http://localhost:8080/api/statistics/ticket-sold-by-month')
        .then(response => response.json())
        .then(data => {
            const months = []; // Mảng lưu các tháng
            const ticketCounts = []; // Mảng lưu số vé được đặt

            // Lặp qua đối tượng dữ liệu để lấy tháng và số vé
            for (let month in data) {
                if (data.hasOwnProperty(month)) {
                    months.push('Tháng ' + month); // Thêm tên tháng
                    ticketCounts.push(data[month]); // Thêm số vé đặt trong tháng
                }
            }

            // Nếu biểu đồ chưa tồn tại thì tạo mới, nếu đã tồn tại thì chỉ cập nhật lại dữ liệu
            if (!bookingChart) {
                const ctx = document.getElementById('bookingChart').getContext('2d');
                bookingChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            label: 'Số Vé Được Đặt',
                            data: ticketCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Số Vé Đặt'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Tháng'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Số Vé Được Đặt Theo Tháng'
                            }
                        }
                    }
                });
            } else {
                // Nếu biểu đồ đã tồn tại, chỉ cập nhật lại dữ liệu
                bookingChart.data.labels = months;
                bookingChart.data.datasets[0].data = ticketCounts;
                bookingChart.update();
            }
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
}

function fetchBooking() {
    fetch('http://localhost:8080/api/statistics/tickets-by-movie')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const labels = Object.keys(data); // Lấy tên phim
            const values = Object.values(data); // Lấy số vé đặt

            // Tạo hiệu ứng màu gradient cho cột biểu đồ
            const ctx2 = document.getElementById('ticketsPerMovieChart').getContext('2d');
            const gradient = ctx2.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(54, 162, 235, 1)');
            gradient.addColorStop(1, 'rgba(75, 192, 192, 1)');

            // Nếu biểu đồ chưa tồn tại thì tạo mới, nếu đã tồn tại thì chỉ cập nhật lại dữ liệu
            if (!ticketsPerMovieChart) {
                ticketsPerMovieChart = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Số Vé Được Đặt',
                            data: values,
                            backgroundColor: gradient,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgb(180,180,186)',
                            hoverBorderColor: 'rgba(75, 192, 192, 1)',
                            hoverBorderWidth: 2
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Số Vé Đặt'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Phim'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Số Vé Được Đặt Theo Phim'
                            }
                        },
                        animation: {
                            duration: 2000,
                            easing: 'easeInOutQuad',
                        }
                    }
                });
            } else {
                // Nếu biểu đồ đã tồn tại, chỉ cập nhật lại dữ liệu
                ticketsPerMovieChart.data.labels = labels;
                ticketsPerMovieChart.data.datasets[0].data = values;
                ticketsPerMovieChart.update();
            }
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
}

// Gọi hàm fetchBookingData và fetchBooking khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    fetchBookingData();
    fetchBooking();
});

// Gọi hàm fetchBookingData và fetchBooking mỗi 5 giây
setInterval(fetchBookingData, 5000);
setInterval(fetchBooking, 5000);

//Danh sách vé đã đặt
// Function để lấy lịch sử đặt vé khách hàng
async function fetchCustomerBookingHistory() {
    try {
        const response = await fetch("http://localhost:8080/api/statistics/customer-booking-history");
        const data = await response.json();

        console.log("Lịch sử đặt vé khách hàng:", data);
        const tableBody = document.querySelector("#ticketTable tbody");
        if (!tableBody) {
            console.error("Không tìm thấy bảng với ID 'ticketTable'");
            return;
        }

        console.log("Lịch sử đặt vé khách hàng:", data);
        tableBody.innerHTML = ""; // Clear existing rows

        data.forEach((item, index) => {
            const row = document.createElement("tr");

            // Tạo và thêm cột STT
            const indexCell = document.createElement("td");
            indexCell.textContent = index + 1;  // Số thứ tự
            row.appendChild(indexCell);

            // Tạo và thêm cột Tên khách hàng
            const nameCell = document.createElement("td");
            nameCell.textContent = item[0];  // Tên khách hàng (u.username)
            row.appendChild(nameCell);

            // Tạo và thêm cột Phim đã đặt
            const movieCell = document.createElement("td");
            movieCell.textContent = item[1];  // Tên phim đã đặt (m.movieName)
            row.appendChild(movieCell);

            // Tạo và thêm cột Ghế ngồi
            const seatCell = document.createElement("td");
            seatCell.textContent = item[3];  // Tên ghế đã đặt (bs.row-bs.column) đã được kết hợp ở phía backend
            row.appendChild(seatCell);

            // Tạo và thêm cột Tên rạp
            const cinemaCell = document.createElement("td");
            cinemaCell.textContent = item[4];  // Tên rạp (c.cinemaName)
            row.appendChild(cinemaCell);

            // Tạo và thêm cột Ngày đặt vé
            const dateCell = document.createElement("td");
            dateCell.textContent = new Date(item[2]).toLocaleString();  // Ngày giờ đặt vé (b.bookingTime)
            row.appendChild(dateCell);

            // Thêm dòng vào bảng
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt vé khách hàng:", error);
    }
}

// Gọi hàm khi trang web được tải
document.addEventListener("DOMContentLoaded", fetchCustomerBookingHistory);
let currentPage = 1;
const itemsPerPage = 10; // Số lượng khách hàng mỗi trang

// Lấy và hiển thị dữ liệu với phân trang
async function fetchCustomerBookingHistory(page = 1) {
    try {
        const response = await fetch("http://localhost:8080/api/statistics/customer-booking-history");
        const data = await response.json();

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Giới hạn dữ liệu cho trang hiện tại
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);

        const tableBody = document.querySelector("#ticketTable tbody");
        if (!tableBody) {
            console.error("Không tìm thấy bảng với ID 'ticketTable'");
            return;
        }

        tableBody.innerHTML = ""; // Clear existing rows

        paginatedData.forEach((item, index) => {
            const row = document.createElement("tr");

            // Tạo và thêm cột STT
            const indexCell = document.createElement("td");
            indexCell.textContent = startIndex + index + 1;  // Số thứ tự
            row.appendChild(indexCell);

            // Tạo và thêm cột Tên khách hàng
            const nameCell = document.createElement("td");
            nameCell.textContent = item[0];  // Tên khách hàng (u.username)
            row.appendChild(nameCell);

            // Tạo và thêm cột Phim đã đặt
            const movieCell = document.createElement("td");
            movieCell.textContent = item[1];  // Tên phim đã đặt (m.movieName)
            row.appendChild(movieCell);

            // Tạo và thêm cột Ghế ngồi
            const seatCell = document.createElement("td");
            seatCell.textContent = item[3];  // Tên ghế đã đặt (bs.row-bs.column) đã được kết hợp ở phía backend
            row.appendChild(seatCell);

            // Tạo và thêm cột Tên rạp
            const cinemaCell = document.createElement("td");
            cinemaCell.textContent = item[4];  // Tên rạp (c.cinemaName)
            row.appendChild(cinemaCell);

            // Tạo và thêm cột Ngày đặt vé
            const dateCell = document.createElement("td");
            dateCell.textContent = new Date(item[2]).toLocaleString();  // Ngày giờ đặt vé (b.bookingTime)
            row.appendChild(dateCell);

            // Thêm dòng vào bảng
            tableBody.appendChild(row);
        });

        // Cập nhật các nút phân trang
        document.querySelector("#prevBtn").disabled = page === 1;
        document.querySelector("#nextBtn").disabled = page === totalPages;

        page = Number(page);
        document.querySelector("#pageInput").value = page;

    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt vé khách hàng:", error);
    }
}

// Gọi hàm khi trang web được tải
document.addEventListener("DOMContentLoaded", () => fetchCustomerBookingHistory(currentPage));

// Lắng nghe sự kiện để chuyển trang
document.querySelector("#prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchCustomerBookingHistory(currentPage);
    }
});

document.querySelector("#nextBtn").addEventListener("click", () => {
    currentPage++;
    fetchCustomerBookingHistory(currentPage);
});

document.querySelector("#pageInput").addEventListener("change", (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1) {
        currentPage = page;
        fetchCustomerBookingHistory(currentPage);
    }
});
