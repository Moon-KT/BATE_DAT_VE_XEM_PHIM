// Lắng nghe sự kiện click vào nút tìm kiếm
document.getElementById("searchButton").addEventListener("click", async () => {
    // Lấy giá trị từ ô input
    const query = document.getElementById("searchInput").value.trim();

    // Kiểm tra nếu ô input không rỗng
    if (query) {
        try {
            // Gửi yêu cầu tìm kiếm đến API
            const response = await fetch(`http://localhost:8080/api/movies/search/${query}`);

            // Kiểm tra trạng thái phản hồi từ API
            if (response.ok) {
                const movies = await response.json(); // Chuyển đổi phản hồi thành JSON

                console.log("Movies found:", movies);
                // Gọi hàm hiển thị dữ liệu trong bảng
                populateMovieTable(movies);
            } else {
                console.error("Error fetching movies:", response.statusText);
                alert("Không tìm thấy phim nào phù hợp.");
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            alert("Có lỗi xảy ra khi tìm kiếm phim. Vui lòng thử lại sau.");
        }
    } else {
        alert("Vui lòng nhập từ khóa tìm kiếm.");
    }
});

// Hàm gọi API để lấy danh sách phim theo bộ lọc
async function filterMovies() {
    const filterSelect = document.getElementById('filterSelect').value;
    let url = 'http://localhost:8080/api/movies/all';

    // Cập nhật URL dựa trên bộ lọc
    switch (filterSelect) {
        case 'new':
            url = 'http://localhost:8080/api/movies/new'; // API trả về danh sách phim mới
            break;
        case 'upcoming':
            url = 'http://localhost:8080/api/movies/upcoming'; // API trả về danh sách phim chưa phát hành
            break;
        case 'mostViewed':
            url = 'http://localhost:8080/api/movies/most-viewed'; // API trả về danh sách phim nhiều lượt xem nhất
            break;
        default:
            url = 'http://localhost:8080/api/movies/all'; // Mặc định là lấy tất cả phim
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const movies = await response.json();
            renderMovieTable(movies); // Hiển thị dữ liệu phim lên bảng
        } else {
            alert('Không thể tải dữ liệu phim theo bộ lọc.');
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu phim.');
    }
}

// Hàm hiển thị dữ liệu trong bảng
function populateMovieTable(movies) {
    const movieTable = document.getElementById("movieTable");

    // Xóa dữ liệu cũ trong bảng
    movieTable.innerHTML = "";

    // Kiểm tra nếu không có phim nào trả về
    if (movies.length === 0) {
        movieTable.innerHTML = "<tr><td colspan='8'>Không tìm thấy phim nào.</td></tr>";
        return;
    }

    // Duyệt qua danh sách phim và thêm vào bảng
    movies.forEach(movie => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${movie.movieId}</td>
            <td>${movie.movieName}</td>
            <td><img src="${movie.moviePoster}" alt="${movie.movieName}" width="50"></td>
            <td>${movie.movieDirector}</td>
            <td>${movie.movieActor}</td>
            <td>${movie.movieDuration} phút</td>
            <td>${movie.movieViews}</td>
            <td>
                <button onclick="viewMovieDetails(${movie.movieId}, false)">Chi Tiết</button>
                <button onclick="viewMovieDetails(${movie.movieId}, true)">Sửa</button>
                <button onclick="deleteMovie(${movie.movieId})">Xóa</button>
            </td>
        `;

        movieTable.appendChild(row);
    });
}

// Mở modal thêm phim
function openAddMovieModal() {
    document.getElementById('modalTitle').textContent = 'Thêm Phim';
    document.getElementById('movieForm').reset(); // Reset form
    document.getElementById('movieId').disabled = true; // Vô hiệu hóa trường ID
    clearSaveButtonHandlers(); // Xóa các trình xử lý trước đó
    document.getElementById('saveButton').onclick = async () => {
        await addMovie(); // Gọi hàm thêm phim
    };
    document.getElementById('movieModal').style.display = 'block'; // Hiển thị modal
}

// Hàm thêm phim
async function addMovie() {
    const movie = {
        movieName: document.getElementById('movieName').value.trim(),
        movieDescription: document.getElementById('movieDescription').value.trim(),
        movieDirector: document.getElementById('movieDirector').value.trim(),
        movieActor: document.getElementById('movieActor').value.trim(),
        movieDuration: parseInt(document.getElementById('movieDuration').value),
        movieReleaseDate: document.getElementById('movieReleaseDate').value,
        movieLanguage: document.getElementById('movieLanguage').value.trim(),
        moviePoster: document.getElementById('moviePoster').value.trim(),
        movieTrailer: document.getElementById('movieTrailer').value.trim()
    };

    try {
        const response = await fetch('http://localhost:8080/api/movies/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie)
        });

        if (response.ok) {
            alert('Thêm phim thành công!');
            closeModal();
            await fetchMovies(); // Tải lại danh sách phim
        } else {
            alert('Thêm phim thất bại.');
        }
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Có lỗi xảy ra khi thêm phim.');
    }
}

// Hàm cập nhật phim
async function updateMovie(movieId) {
    const movie = {
        movieId,
        movieName: document.getElementById('movieName').value.trim(),
        movieDescription: document.getElementById('movieDescription').value.trim(),
        movieDirector: document.getElementById('movieDirector').value.trim(),
        movieActor: document.getElementById('movieActor').value.trim(),
        movieDuration: parseInt(document.getElementById('movieDuration').value),
        movieReleaseDate: document.getElementById('movieReleaseDate').value,
        movieLanguage: document.getElementById('movieLanguage').value.trim(),
        moviePoster: document.getElementById('moviePoster').value.trim(),
        movieTrailer: document.getElementById('movieTrailer').value.trim()
    };

    try {
        const response = await fetch(`http://localhost:8080/api/movies/${movieId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie)
        });

        if (response.ok) {
            alert('Cập nhật phim thành công!');
            closeModal();
            await fetchMovies(); // Tải lại danh sách phim
        } else {
            alert('Cập nhật phim thất bại.');
        }
    } catch (error) {
        console.error('Error updating movie:', error);
        alert('Có lỗi xảy ra khi cập nhật phim.');
    }
}

// Hàm xem chi tiết hoặc sửa phim
async function viewMovieDetails(movieId, isEdit = false) {
    try {
        const response = await fetch(`http://localhost:8080/api/movies/${movieId}`);
        const movie = await response.json();

        // Cập nhật các trường trong modal
        document.getElementById('movieId').value = movie.movieId;
        document.getElementById('movieName').value = movie.movieName;
        document.getElementById('movieDescription').value = movie.movieDescription;
        document.getElementById('movieDirector').value = movie.movieDirector;
        document.getElementById('movieActor').value = movie.movieActor;
        document.getElementById('movieDuration').value = movie.movieDuration;
        document.getElementById('movieReleaseDate').value = movie.movieReleaseDate.split("T")[0];
        document.getElementById('movieLanguage').value = movie.movieLanguage;
        document.getElementById('moviePoster').value = movie.moviePoster;
        document.getElementById('movieTrailer').value = movie.movieTrailer;

        document.getElementById('modalTitle').textContent = isEdit ? 'Sửa Phim' : 'Chi Tiết Phim';
        clearSaveButtonHandlers(); // Xóa các trình xử lý trước đó

        if (isEdit) {
            document.getElementById('saveButton').onclick = async () => {
                await updateMovie(movieId); // Gọi hàm updateMovie
            };
            document.getElementById('saveButton').style.display = 'inline-block';
        } else {
            document.getElementById('saveButton').style.display = 'none';
        }

        document.getElementById('movieModal').style.display = 'block'; // Hiển thị modal
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Có lỗi xảy ra khi lấy thông tin phim.');
    }
}

// Hàm xóa phim
async function deleteMovie(movieId) {
    if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/movies/${movieId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Xóa thành công!");
                await fetchMovies(); // Làm mới danh sách phim
            } else {
                alert("Không thể xóa phim.");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            alert("Có lỗi xảy ra.");
        }
    }
}

// Hàm đóng modal
function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
}

// Xóa các trình xử lý sự kiện của nút lưu
function clearSaveButtonHandlers() {
    const saveButton = document.getElementById('saveButton');
    const newButton = saveButton.cloneNode(true); // Clone để xóa sự kiện
    saveButton.parentNode.replaceChild(newButton, saveButton);
}

// Tải danh sách phim và hiển thị trên bảng
async function fetchMovies() {
    try {
        const response = await fetch('http://localhost:8080/api/movies/all');
        const movies = await response.json();
        renderMovieTable(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        alert('Có lỗi xảy ra khi tải danh sách phim.');
    }
}

// Render danh sách phim vào bảng
function renderMovieTable(movies) {
    const movieTable = document.getElementById('movieTable');
    movieTable.innerHTML = '';

    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.movieId}</td>
            <td>${movie.movieName}</td>
            <td><img src="${movie.moviePoster}" alt="${movie.movieName}" width="100" height="150"></td>
            <td>${movie.movieDirector}</td>
            <td>${movie.movieActor}</td>
            <td>${movie.movieDuration} phút</td>
            <td>${movie.movieViews || 0}</td>
            <td>
                <button onclick="viewMovieDetails(${movie.movieId}, false)">Chi Tiết</button>
                <button onclick="viewMovieDetails(${movie.movieId}, true)">Sửa</button>
                <button onclick="deleteMovie(${movie.movieId})">Xóa</button>
            </td>
        `;
        movieTable.appendChild(row);
    });
}

// Khởi tạo danh sách phim khi trang tải
document.addEventListener('DOMContentLoaded', fetchMovies);
