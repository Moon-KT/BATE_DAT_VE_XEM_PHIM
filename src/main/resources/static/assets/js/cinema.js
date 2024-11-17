const BASE_CINEMA_URL = 'http://localhost:8080/api/cinemas';

function fetchCinemas() {
    fetch(`${BASE_CINEMA_URL}/all`)
        .then(response => response.json())
        .then(cinemas => {
            const cinemaTable = document.getElementById("cinemaTable");
            cinemaTable.innerHTML = ''; // Clear the old table

            cinemas.forEach(cinema => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cinema.cinemaId}</td>
                    <td>${cinema.cinemaName}</td>
                    <td>${cinema.hotline}</td>
                    <td>
                        <button class="btn btn-warning" onclick="showCinemaDetails(${cinema.cinemaId})">Chi Tiết</button>
                        <button class="btn btn-danger" onclick="deleteCinema(${cinema.cinemaId})">Xóa</button>
                    </td>
                `;
                cinemaTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function searchCinemaByName(name) {
    fetch(`${BASE_CINEMA_URL}/search/${name}`)
        .then(response => response.json())
        .then(cinemas => {
            const cinemaTable = document.getElementById("cinemaTable");
            cinemaTable.innerHTML = ''; // Clear the old table

            cinemas.forEach(cinema => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cinema.cinemaId}</td>
                    <td>${cinema.cinemaName}</td>
                    <td>${cinema.hotline}</td>
                    <td>
                        <button class="btn btn-warning" onclick="showCinemaDetails(${cinema.cinemaId})">Chi Tiết</button>
                        <button class="btn btn-danger" onclick="deleteCinema(${cinema.cinemaId})">Xóa</button>
                    </td>
                `;
                cinemaTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById("searchButton").addEventListener("click", function() {
    const name = document.getElementById("searchInput").value;
    searchCinemaByName(name);
});

function showCinemaDetails(cinemaId = null) {
    const cinemaIdInput = document.getElementById("cinemaId");
    const cinemaName = document.getElementById("cinemaName");
    const hotline = document.getElementById("hotline");
    const detailedAddress = document.getElementById("detailedAddress");
    const locationId = document.getElementById("locationId");

    if (cinemaId) {
        fetch(`${BASE_CINEMA_URL}/${cinemaId}`)
            .then(response => response.json())
            .then(cinema => {
                cinemaIdInput.value = cinema.cinemaId;
                cinemaName.value = cinema.cinemaName;
                hotline.value = cinema.hotline;
                detailedAddress.value = cinema.detailedAddress;
                locationId.value = cinema.locationId;
            })
            .catch(error => console.error('Error:', error));
    } else {
        cinemaIdInput.value = "";
        cinemaName.value = "";
        hotline.value = "";
        detailedAddress.value = "";
        locationId.value = "";
    }

    const cinemaModal = document.getElementById("cinemaModal");
    cinemaModal.style.display = "block";
}

function saveCinema(event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    const cinemaId = document.getElementById("cinemaId").value; // Get hidden ID field
    const cinemaName = document.getElementById("cinemaName").value;
    const hotline = document.getElementById("hotline").value;
    const detailedAddress = document.getElementById("detailedAddress").value;
    const locationId = document.getElementById("locationId").value;

    // Prepare the cinema data object
    const cinemaData = {
        cinemaName,
        hotline,
        detailedAddress,
        locationId
    };

    let method = "POST";
    let url = `${BASE_CINEMA_URL}/create`; // Default to POST (create new)

    if (cinemaId) { // If ID exists, perform update
        method = "PUT";
        url = `${BASE_CINEMA_URL}/${cinemaId}`;
    }

    // Send the request
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cinemaData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(() => {
            fetchCinemas(); // Refresh the cinemas list
            closeModal(); // Close the modal
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
}

function deleteCinema(cinemaId) {
    if (confirm("Bạn có chắc chắn muốn xóa rạp chiếu phim này?")) {
        fetch(`${BASE_CINEMA_URL}/${cinemaId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(() => {
                fetchCinemas();
            })
            .catch(err => {
                alert("Lỗi: " + err.message);
            });
    }
}

function closeModal() {
    const cinemaModal = document.getElementById("cinemaModal");
    cinemaModal.style.display = "none";
}

// Add event listener for form submission
document.getElementById("cinemaForm").addEventListener('submit', saveCinema);

document.addEventListener('DOMContentLoaded', () => {
    fetchCinemas();
});