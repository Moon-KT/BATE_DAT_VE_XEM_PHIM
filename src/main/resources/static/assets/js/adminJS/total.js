// Hàm lấy dữ liệu doanh số hàng tháng
async function fetchMonthlySales(year) {
    try {
        const response = await fetch(`http://localhost:8080/api/statistics/yearly-sales?year=${year}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Dữ liệu trả về từ API:', data);

        // Kiểm tra nếu dữ liệu không phải là đối tượng
        if (typeof data !== 'object') {
            throw new Error("Dữ liệu trả về không phải là đối tượng.");
        }

        // Chuyển đổi đối tượng thành mảng
        const labels = Object.keys(data).map(month => `Tháng ${month}`);
        const salesData = Object.values(data);

        return {labels, salesData};
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        return {labels: [], salesData: []}; // Trả về mảng trống nếu có lỗi
    }
}

// Hàm để tạo biểu đồ
async function createMonthlySalesChart(year) {
    try {
        const {labels, salesData} = await fetchMonthlySales(year);

        if (labels.length === 0 || salesData.length === 0) {
            console.error("Không có dữ liệu để hiển thị.");
            return;
        }

        const ctx = document.getElementById('chart-2').getContext('2d');

        new Chart(ctx, {
            type: 'line', // Bạn có thể thay đổi thành loại biểu đồ khác
            data: {
                labels: labels, // Các nhãn là các tháng
                datasets: [{
                    label: 'Doanh thu theo tháng',
                    data: salesData, // Doanh thu của từng tháng
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Lỗi khi tạo biểu đồ:", error);
    }
}


// Gọi hàm tạo biểu đồ cho năm hiện tại
// Đảm bảo rằng DOM đã tải xong trước khi gọi hàm
document.addEventListener('DOMContentLoaded', function () {
    // Gọi hàm tạo biểu đồ sau khi DOM đã tải hoàn tất
    createMonthlySalesChart(2024); // Thay 2024 bằng năm bạn muốn
});

// Hàm này sẽ gọi API để lấy dữ liệu của phim
async function fetchTopMovies(month, year) {
    try {
        // Gọi API để lấy dữ liệu phim từ backend
        const response = await fetch(`http://localhost:8080/api/statistics/top-movies/${month}/${year}`);

        if (!response.ok) {
            throw new Error('Dữ liệu không hợp lệ');
        }

        const data = await response.json();  // Giả sử dữ liệu trả về có dạng [{ movieName: "Movie 1", views: 100 }, ...]

        console.log('Dữ liệu phim:', data);
        // Lấy tên phim và số lượt xem
        const movieNames = Object.keys(data);  // Tên phim
        const views = Object.values(data);  // Tổng giá trị

        renderChart(movieNames, views);  // Gọi hàm renderChart để vẽ biểu đồ
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
}

// Hàm để vẽ biểu đồ sử dụng Chart.js
function renderChart(movieNames, views) {
    const ctx = document.getElementById('topMoviesChart').getContext('2d');

    // Tạo biểu đồ với Chart.js
    const chart = new Chart(ctx, {
        type: 'bar',  // Loại biểu đồ cột
        data: {
            labels: movieNames,  // Tên phim (trục X)
            datasets: [{
                label: 'Doanh số phim',  // Nhãn cho dữ liệu
                data: views,  // Dữ liệu lượt xem
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Màu nền cho cột
                borderColor: 'rgba(75, 192, 192, 1)',  // Màu viền của cột
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true  // Đảm bảo trục Y bắt đầu từ 0
                }
            }
        }
    });
}

// Hàm gọi API và vẽ biểu đồ khi người dùng bấm nút
function loadChart() {
    const month = document.getElementById('month').value;  // Lấy tháng từ input
    const year = document.getElementById('year').value;    // Lấy năm từ input

    fetchTopMovies(month, year);  // Gọi hàm fetchTopMovies để lấy dữ liệu và vẽ biểu đồ
}

document.getElementById('searchButton').addEventListener('click', searchMovie);

async function searchMovie() {
    const searchQuery = document.getElementById('searchInput').value;
    if (!searchQuery) return; // Không thực hiện nếu input trống

    // Gửi yêu cầu tìm kiếm phim
    try {
        const response = await fetch(`http://localhost:8080/api/movies/search/${searchQuery}`);
        const movieData = await response.json();

        // Nếu không có kết quả, thông báo không tìm thấy
        if (!movieData || movieData.length === 0) {
            alert("Không tìm thấy phim!");
            return;
        }

        // Hiển thị bảng thông tin
        displayMovieInfo(movieData);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm phim:', error);
    }
}

function displayMovieInfo(movieData) {
    const movieInfoTable = document.getElementById('movieInfoTable');
    const tableBody = movieInfoTable.querySelector('tbody');

    // Xóa dữ liệu cũ trong bảng
    tableBody.innerHTML = '';

    // Duyệt qua từng phim và hiển thị thông tin
    movieData.forEach(movie => {
        const row = document.createElement('tr');
        console.log(movie);
        // Tạo các ô thông tin cho từng phim
        row.innerHTML = `
            <td>${movie.movieName}</td>
            <td>${movie.movieViews || 0}</td>
            <td>${movie.movieRevenue || 0}</td>
            <td>${movie.combos ? movie.combos.join(', ') : 'Không có combo'}</td>
        `;

        // Thêm dòng vào bảng
        tableBody.appendChild(row);
    });

    // Hiển thị bảng
    movieInfoTable.style.display = 'table';
}

