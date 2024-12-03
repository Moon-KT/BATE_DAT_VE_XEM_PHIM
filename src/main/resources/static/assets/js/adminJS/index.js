
    async function countUserAccounts(){
        try {
            const response = await fetch('http://localhost:8080/api/statistics/total-user');
            if (!response.ok) {
                throw new Error('Failed to fetch user accounts');
            }
            const responseText = await response.text();
            const totalUser = JSON.parse(responseText);
            document.getElementById('totalUser').textContent = totalUser;
        } catch (err) {
            console.error(err);
        }
    }

    window.onload = countUserAccounts();

    async function countMovie(){
        try {
            const response = await fetch('http://localhost:8080/api/statistics/total-movie');
            if (!response.ok) {
                throw new Error('Failed to fetch movie');
            }

            const totalMovie = await response.json();

            document.getElementById('totalMovie').textContent = totalMovie;
        }catch (err) {
            console.error(err);
        }
    }

    window.onload = countMovie();

    async function countTicket(){
        try {
            const response = await fetch('http://localhost:8080/api/statistics/total-ticket-sold');
            if (!response.ok) {
                throw new Error('Failed to fetch ticket');
            }

            const totalTicket = await response.json();

            document.getElementById('totalTicket').textContent = totalTicket;
        }catch (err) {
            console.error(err);
        }
    }

    window.onload = countTicket();

    async function totalRevenue(){
        try {
            const response = await fetch('http://localhost:8080/api/statistics/total-revenue');
            if (!response.ok) {
                throw new Error('Failed to fetch ticket');
            }

            const totalRevenue = await response.json();

            document.getElementById('totalRevenue').textContent = totalRevenue;
        }catch (err) {
            console.error(err);
        }
    }

    window.onload = totalRevenue();

    async function getTopMovies() {
        try {
            const response = await fetch('http://localhost:8080/api/statistics/top-movie');
            const movies = await response.json();

            // Hiển thị thông tin phim trên bảng
            let table = document.getElementById("movieTableHot");
            table.innerHTML = ""; // Xóa nội dung cũ

            movies.forEach(movie => {
                let row = table.insertRow();
                let nameCell = row.insertCell(0);
                let posterCell = row.insertCell(1);
                let genreCell = row.insertCell(2);
                let durationCell = row.insertCell(3);
                let viewsCell = row.insertCell(4);

                // Thiết lập dữ liệu cho từng ô
                nameCell.textContent = movie.name;

                // Thêm ảnh vào ô poster
                let img = document.createElement("img");
                img.src = movie.poster;
                img.alt = movie.name;
                img.width = 100; // Đặt kích thước ảnh (chiều rộng)
                img.height = 150; // Đặt kích thước ảnh (chiều cao)
                posterCell.appendChild(img);

                genreCell.textContent = movie.genres.join(", ");
                durationCell.textContent = `${movie.duration} phút`;
                viewsCell.textContent = movie.views;
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phim:", error);
        }
    }

    getTopMovies();

    // Call the function when the page loads
    window.onload = getTopMovies;

    // Function để lấy lịch sử đặt vé khách hàng
    async function fetchCustomerBookingHistory() {
        try {
            const response = await fetch("http://localhost:8080/api/statistics/customer-booking-history");
            const data = await response.json();

            // Giới hạn dữ liệu trả về là 10 khách hàng
            const limitedData = data.slice(0, 10); // Lấy 10 khách hàng đầu tiên

            const tableBody = document.querySelector("#customer-table tbody");
            if (!tableBody) {
                console.error("Không tìm thấy bảng với ID 'customer-table'");
                return;
            }

            console.log("Lịch sử đặt vé khách hàng:", limitedData);
            tableBody.innerHTML = ""; // Clear existing rows

            limitedData.forEach(item => {
                const row = document.createElement("tr");

                // Tạo và thêm cột Tên khách hàng
                const nameCell = document.createElement("td");
                nameCell.textContent = item[0];  // Tên khách hàng
                row.appendChild(nameCell);

                // Tạo và thêm cột Phim đã đặt
                const movieCell = document.createElement("td");
                movieCell.textContent = item[1];  // Tên phim đã đặt
                row.appendChild(movieCell);

                // Tạo và thêm cột Ngày đặt vé
                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(item[2]).toLocaleString();  // Ngày giờ đặt vé
                row.appendChild(dateCell);

                // // Tạo và thêm cột Số lượng vé
                const seatCell = document.createElement("td");
                seatCell.textContent = item[5];  // Số lượng vé đã đặt
                row.appendChild(seatCell);

                // Thêm dòng vào bảng
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đặt vé khách hàng:", error);
        }
    }

    // Gọi hàm khi trang web được tải
    document.addEventListener("DOMContentLoaded", fetchCustomerBookingHistory);