// Mở modal thêm phim
function openAddMovieModal() {
    document.getElementById('modalTitle').textContent = 'Thêm Phim';
    document.getElementById('movieForm').reset(); // Reset form
    document.getElementById('movieId').disabled = true; // Vô hiệu hóa trường ID
    document.getElementById('saveButton').onclick = addMovie; // Gắn sự kiện thêm phim
    document.getElementById('movieModal').style.display = 'block'; // Hiển thị modal
}

// Hàm thêm phim
async function addMovie() {
    const movie = {
        movieName: document.getElementById('movieName').value,
        movieDescription: document.getElementById('movieDescription').value,
        movieDirector: document.getElementById('movieDirector').value,
        movieActor: document.getElementById('movieActor').value,
        movieDuration: parseInt(document.getElementById('movieDuration').value),
        movieReleaseDate: document.getElementById('movieReleaseDate').value,
        movieLanguage: document.getElementById('movieLanguage').value,
        moviePoster: document.getElementById('moviePoster').value,
        movieTrailer: document.getElementById('movieTrailer').value
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
            fetchMovies(); // Tải lại danh sách phim
        } else {
            alert('Thêm phim thất bại.');
        }
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Có lỗi xảy ra khi thêm phim.');
    }
}

// Mở modal xem chi tiết phim
async function viewMovieDetails(movieId) {
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

        document.getElementById('modalTitle').textContent = 'Chi Tiết Phim';
        document.getElementById('saveButton').onclick = () => updateMovie(movieId); // Gắn sự kiện sửa phim

        document.getElementById('movieModal').style.display = 'block'; // Hiển thị modal
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Có lỗi xảy ra khi lấy thông tin phim.');
    }
}

// Hàm cập nhật phim
async function updateMovie(movieId) {
    const movie = {
        movieId,
        movieName: document.getElementById('movieName').value,
        movieDescription: document.getElementById('movieDescription').value,
        movieDirector: document.getElementById('movieDirector').value,
        movieActor: document.getElementById('movieActor').value,
        movieDuration: parseInt(document.getElementById('movieDuration').value),
        movieReleaseDate: document.getElementById('movieReleaseDate').value,
        movieLanguage: document.getElementById('movieLanguage').value,
        moviePoster: document.getElementById('moviePoster').value,
        movieTrailer: document.getElementById('movieTrailer').value
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
            fetchMovies(); // Tải lại danh sách phim
        } else {
            alert('Cập nhật phim thất bại.');
        }
    } catch (error) {
        console.error('Error updating movie:', error);
        alert('Có lỗi xảy ra khi cập nhật phim.');
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
                location.reload(); // Làm mới bảng sau khi xóa
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
            <td>${movie.movieViews}</td>
            <td>
                <button onclick="viewMovieDetails(${movie.movieId})">Chi Tiết</button>
                <button onclick="openEditMovieModal(${movie.movieId})">Sửa</button>
                <button onclick="deleteMovie(${movie.movieId})">Xóa</button>
            </td>
        `;
        movieTable.appendChild(row);
    });
}

// Khởi tạo danh sách phim khi trang tải
fetchMovies();
