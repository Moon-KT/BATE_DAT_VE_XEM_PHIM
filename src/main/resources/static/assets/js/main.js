// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

//
// // ===============Quản lý phim==========================
// const apiUrl = 'http://localhost:8080/api/movies/all';
// let movies = [];
//
// function displayMovies(movies) {
// const table = document.getElementById("movieTable");
// table.innerHTML = ""; // Xóa nội dung cũ
//
// movies.forEach(movie => {
//   const row = document.createElement("tr");
//   row.innerHTML = `
//       <td>${movie.movieId}</td>
//       <td>${movie.movieName}</td>
//       <td>${movie.movieDirector}</td>
//       <td>${movie.movieActor}</td>
//        <td>${movie.movie_genreList}</td>
//       <td>${movie.moviePoster}</td>
//       <td>${movie.movieReleaseDate}</td>
//       <td>${movie.movieDuration} phút</td>
//         <td>${movie.movieViews}</td>
//       <td>
//           <button class="btn-sua" onclick="editMovie(${movie.movieId})">Sửa</button>
//           <button class="btn-xoa" onclick="confirmDeleteMovie(${movie.movieId})">Xóa</button>
//       </td>
//   `;
//   table.appendChild(row);
// });
// }
// // Function to fetch movies from the API
// async function fetchMovies() {
//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) throw new Error("Không thể tải dữ liệu phim");
//     } catch (error) {
//         console.log(error);
//     }
// }
//
// // Call the fetchMovies function when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     fetchMovies().then((movies) => displayMovies(movies));
// });
//
// function filterMovies(filterType) {
//   let filteredMovies = [];
//
//   switch (filterType) {
//       case 'new':
//           filteredMovies = movies.filter(movie => movie.movieViews < 10);
//           break;
//       case 'mostViewed':
//           filteredMovies = movies.filter(movie => movie.views >= 50);
//           break;
//       case 'leastViewed':
//           filteredMovies = movies.filter(movie => movie.views < 50);
//           break;
//       case 'all':
//           filteredMovies = movies; // Hiển thị lại tất cả phim
//           break;
//       default:
//           filteredMovies = movies;
//   }
//   displayMovies(filteredMovies);
// }
//
// const searchApi = 'http://localhost:8080/api/movies/search';
// function searchMovies() {
//   const query = document.getElementById("searchInput").value.toLowerCase();
//   const filteredMovies = movies.filter(movie =>
//       movie.name.toLowerCase().includes(query)
//   );
//   displayMovies(filteredMovies);
// }
//
// function confirmAddOrUpdateMovie() {
//   const editIndex = document.getElementById("editIndex").value;
//
//   if (editIndex === "") {
//       addOrUpdateMovie();
//   } else {
//       // Hiển thị hộp thoại xác nhận trước khi cập nhật
//       const confirmed = confirm("Bạn có chắc chắn muốn cập nhật phim này không?");
//       if (confirmed) {
//           addOrUpdateMovie();
//       }
//   }
// }
//
// function addOrUpdateMovie() {
//   const movieId = document.getElementById("movieId").value;
//   const movieName = document.getElementById("movieName").value;
//   const director = document.getElementById("director").value;
//   const actors = document.getElementById("actors").value;
//   const duration = document.getElementById("duration").value;
//   const views = document.getElementById("viewer").value;
//   const editIndex = document.getElementById("editIndex").value;
//
//   // Check if any field is empty
//   if (!movieName || !director || !actors || !duration) {
//       alert("All fields must be filled out to add or update a movie.");
//       return;
//   }
//
//   const newMovie = { id: movieId, name: movieName, director, actors, duration,views };
//
//  const requestOptions = {
//         method: movieId ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newMovie)
//  }
//
//     fetch(apiUrl, requestOptions)
//         .then(response => {
//             if (response.ok) {
//                 alert(movieId ? 'Cập nhật thành công!' : 'Thêm thành công!');
//                 fetchMovies();
//                 clearForm();
//             }
//         })
//         .catch(error => {
//             alert('Lỗi khi lưu phim');
//         }
//     );
//
//   // displayMovies();
//   clearForm();
// }
//
// function editMovie(movieId) {
//     const response = fetch(`${apiURL}/${movieId}`);
//     const movie = response.json();
//
//     document.getElementById("movieId").value = movie.movieId;
//     document.getElementById("movieName").value = movie.movieName;
//     document.getElementById("director").value = movie.movieDirector;
//     document.getElementById("actors").value = movie.movieActor;
//     document.getElementById("duration").value = movie.movieDuration;
//     document.getElementById("viewer").value = movie.movieViews;
//     document.getElementById("editIndex").value = movieId;
// }
//
// function confirmDeleteMovie(index) {
//   // Hiển thị hộp thoại xác nhận trước khi xóa
//   const confirmed = confirm("Bạn có chắc chắn muốn xóa phim này không?");
//   if (confirmed) {
//       deleteMovie(index);
//   }
// }
//
// function deleteMovie(index) {
//     if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
//         const response =  fetch(`${'http://localhost:8080/api/movies'}/${movieId}`, { method: 'DELETE' });
//         if (response.ok) {
//             alert('Xóa thành công!');
//             fetchMovies();
//         } else {
//             alert('Lỗi khi xóa phim');
//         }
//     }  displayMovies();
// }
//
// function clearForm() {
//   document.getElementById("movieId").value = "";
//   document.getElementById("movieName").value = "";
//   document.getElementById("director").value = "";
//   document.getElementById("actors").value = "";
//   document.getElementById("duration").value = "";
//   document.getElementById("viewer").value = "";
//   document.getElementById("editIndex").value = "";
// }
//
//
// // ============= xử lý quản lý rạp phim =============
// function displayCinemas(filteredCinemas = cinemas) {
//   const table = document.getElementById("cinemaTable");
//   table.innerHTML = ""; // Xóa nội dung cũ
//
//   filteredCinemas.forEach((cinema, index) => {
//       const row = document.createElement("tr");
//
//       row.innerHTML = `
//           <td>${cinema.id}</td>
//           <td>${cinema.name}</td>
//           <td>${cinema.location}</td>
//           <td>${cinema.hotline}</td>
//           <td>${cinema.lcinema}</td>
//           <td>
//               <button class="btn-sua" onclick="editCinema(${index})">Sửa</button>
//               <button class="btn-xoa" onclick="confirmDeleteCinema(${index})">Xóa</button>
//           </td>
//       `;
//       table.appendChild(row);
//   });
// }
//
// function searchCinemas() {
//   const queryCinema = document.getElementById("searchCinema").value.toLowerCase();
//   const  filteredCinemas = cinemas.filter(cinema =>
//       cinema.name.toLowerCase().includes(queryCinema)
//   );
//   displayCinemas(filteredCinemas);
// }
//
// function confirmAddOrUpdateCinema() {
//   const editIndex = document.getElementById("editIndex").value;
//
//   if (editIndex === "") {
//       addOrUpdateCinema();
//   } else {
//       // Hiển thị hộp thoại xác nhận trước khi cập nhật
//       const confirmed = confirm("Bạn có chắc chắn muốn cập nhật phim này không?");
//       if (confirmed) {
//           addOrUpdateCinema();
//       }
//   }
// }
//
// function addOrUpdateCinema() {
//   const cinemaId = document.getElementById("cinemaId").value;
//   const cinemaName = document.getElementById("cinemaName").value;
//   const location = document.getElementById("location").value;
//   const hotline = document.getElementById("hotline").value;
//   const lcinema = document.getElementById("lcinema").value;
//   const editIndex = document.getElementById("editIndex").value;
//
//   // Check if any field is empty
//   if (!cinemaId || !cinemaName || !location || !hotline || !lcinema) {
//       alert("All fields must be filled out to add or update a cinema.");
//       return;
//   }
//
//   const newCinema = { id: cinemaId, name: cinemaName, location, hotline, lcinema };
//
//   if (editIndex === "") {
//       // Add new cinema to the array
//       cinemas.push(newCinema);
//   } else {
//       // Update the existing cinema information
//       cinemas[editIndex] = newCinema;
//   }
//
//   displayCinemas();
//   clearFormcinema();
// }
//
// function editCinema(index) {
//   const cinema = cinemas[index];
//   document.getElementById("cinemaId").value = cinema.id;
//   document.getElementById("cinemaName").value = cinema.name;
//   document.getElementById("location").value = cinema.location;
//   document.getElementById("hotline").value = cinema.hotline;
//   document.getElementById("lcinema").value = cinema.lcinema;
//   document.getElementById("editIndex").value = index;
// }
//
// function confirmDeleteCinema(index) {
//   // Hiển thị hộp thoại xác nhận trước khi xóa
//   const confirmed = confirm("Bạn có chắc chắn muốn xóa phim này không?");
//   if (confirmed) {
//       deleteCinema(index);
//   }
// }
//
// function deleteCinema(index) {
//   cinemas.splice(index, 1);
//   displayCinemas();
// }
//
// function clearFormcinema() {
//   document.getElementById("cinemaId").value = "";
//   document.getElementById("cinemaName").value = "";
//   document.getElementById("location").value = "";
//   document.getElementById("hotline").value = "";
//   document.getElementById("lcinema").value = "";
//   document.getElementById("editIndex").value = "";
// }
//
// // Hiển thị danh sách phim khi tải trang
// displayCinemas();
//
//
// // ======================= Quản lý Customer====================
// function signOut() {
//   if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
//       // Đăng xuất và chuyển hướng tới trang đăng nhập
//       localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
//       window.location.replace('login.html'); // Chuyển hướng
//   }
// }