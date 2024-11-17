function fetchBookingData() {
    fetch('http://localhost:8080/api/statistics/ticket-sold-by-month')
        .then(response => response.json())
        .then(data => {
            // Kiểm tra dữ liệu nhận được
            console.log(data); // In ra console để kiểm tra

            const months = []; // Mảng lưu các tháng
            const ticketCounts = []; // Mảng lưu số vé được đặt

            // Lặp qua đối tượng dữ liệu để lấy tháng và số vé
            for (let month in data) {
                if (data.hasOwnProperty(month)) {
                    months.push('Tháng ' + month); // Thêm tên tháng
                    ticketCounts.push(data[month]); // Thêm số vé đặt trong tháng
                }
            }

            // Vẽ biểu đồ
            const ctx = document.getElementById('bookingChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar', // Loại biểu đồ (cột)
                data: {
                    labels: months, // Các tháng (trục x)
                    datasets: [{
                        label: 'Số Vé Được Đặt',
                        data: ticketCounts, // Số vé đặt (trục y)
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
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
}

// Gọi hàm fetchBookingData khi trang được tải
fetchBookingData();
// API để lấy thống kê số vé đặt theo phim

// Hàm lấy dữ liệu thống kê số vé đặt theo phim
function fetchBooking() {
    fetch('http://localhost:8080/api/statistics/tickets-by-movie')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const labels = Object.keys(data); // Lấy tên phim
            const values = Object.values(data); // Lấy số vé đặt

            // Tạo hiệu ứng màu gradient cho cột biểu đồ
            const ctx2 = document.getElementById('ticketsPerMovieChart').getContext('2d');
            const gradient = ctx2.createLinearGradient(0, 0, 0, 400); // Gradient từ trên xuống dưới
            gradient.addColorStop(0, 'rgba(54, 162, 235, 1)'); // Màu đầu tiên (xanh lam đậm)
            gradient.addColorStop(1, 'rgba(75, 192, 192, 1)'); // Màu thứ hai (xanh lá)

            // Vẽ biểu đồ
            new Chart(ctx2, {
                type: 'bar', // Loại biểu đồ (cột ngang)
                data: {
                    labels: labels, // Tên các phim
                    datasets: [{
                        label: 'Số Vé Được Đặt',
                        data: values, // Dữ liệu số vé đặt
                        backgroundColor: gradient, // Sử dụng gradient làm màu nền
                        borderColor: 'rgba(75, 192, 192, 1)', // Màu đường viền
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgb(180,180,186)', // Màu khi hover (màu cam)
                        hoverBorderColor: 'rgba(75, 192, 192, 1)', // Màu viền khi hover
                        hoverBorderWidth: 2 // Độ dày viền khi hover
                    }]
                },
                options: {
                    indexAxis: 'y', // Biểu đồ cột ngang
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
                        duration: 2000, // Thời gian hiệu ứng vẽ biểu đồ
                        easing: 'easeInOutQuad', // Kiểu hiệu ứng
                    }
                }
            });
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
}

// Gọi hàm fetchBooking khi trang được tải
fetchBooking();


