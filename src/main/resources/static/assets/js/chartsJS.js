async function fetchTopMoviesBySales(month, year) {
    try {
        const response = await fetch(`http://localhost:8080/api/statistics/top-movies/${month}/${year}`);
        const data = await response.json();

        const labels = Object.keys(data);
        const salesData = Object.values(data);

        return {labels, salesData};
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return {labels: [], salesData: []};
    }
}

async function createTopMoviesChart(month, year) {
    const {labels, salesData} = await fetchTopMoviesBySales(month, year);

    if (labels.length === 0 || salesData.length === 0) {
        console.error("Không có dữ liệu để hiển thị.");
        return;
    }

    // Sắp xếp phim theo doanh thu (từ cao đến thấp)
    const movies = labels.map((label, index) => ({
        label: label,
        sales: salesData[index]
    }));

    // Sắp xếp giảm dần theo doanh thu
    movies.sort((a, b) => b.sales - a.sales);

    // Lấy 2 phim đầu tiên và gộp các phim còn lại thành một nhóm "Khác"
    const topMovies = movies.slice(0, 5);
    const otherMovies = movies.slice(5);
    const otherSales = otherMovies.reduce((acc, movie) => acc + movie.sales, 0);

    // Cập nhật lại labels và salesData
    const updatedLabels = topMovies.map(movie => movie.label).concat('Khác');
    const updatedSalesData = topMovies.map(movie => movie.sales).concat(otherSales);

    const ctx = document.getElementById('chart-1').getContext('2d');

    // Kiểm tra nếu ctx là null (canvas không tồn tại trong DOM)
    if (!ctx) {
        throw new Error("Không thể tìm thấy phần tử canvas với id 'chart-1'.");
    }

    new Chart(ctx, {
        type: 'pie', // Biểu đồ tròn
        data: {
            labels: updatedLabels, // Tên phim và "Khác"
            datasets: [{
                label: 'Doanh thu theo phim',
                data: updatedSalesData, // Doanh thu của 5 phim đứng đầu và nhóm "Khác"
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(66,68,69)',
                    'rgb(218,57,21)',
                    'rgb(179,20,90)',
                    'rgb(54, 162, 235)',
                    'rgb(48,3,3)'  // Màu cho nhóm "Khác"
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 15,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toLocaleString() + ' VND';
                        }
                    }
                }
            }
        }
    });
}

// Gọi hàm sau khi DOM đã tải hoàn tất
document.addEventListener('DOMContentLoaded', function () {
    // Chọn tháng và năm bạn muốn
    createTopMoviesChart(10, 2024); // Ví dụ: tháng 10, năm 2024
});


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
            type: 'bar', // Bạn có thể thay đổi thành loại biểu đồ khác
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

