const BASE_ROOM_URL = 'http://localhost:8080/api/rooms';

function fetchRooms() {
    fetch(`${BASE_ROOM_URL}/all`)
        .then(response => response.json())
        .then(rooms => {
            const roomTable = document.getElementById("roomTable");
            roomTable.innerHTML = ''; // Clear the old table

            rooms.forEach(room => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${room.roomId}</td>
                    <td>${room.roomName}</td>
                    <td>
                        <button class="btn btn-warning" onclick="showRoomDetails(${room.roomId})">Chi Tiết</button>
                        <button class="btn btn-danger" onclick="deleteRoom(${room.roomId})">Xóa</button>
                    </td>
                `;
                roomTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function searchRoomByName(name) {
    fetch(`${BASE_ROOM_URL}/search/${name}`)
        .then(response => response.json())
        .then(rooms => {
            const roomTable = document.getElementById("roomTable");
            roomTable.innerHTML = ''; // Clear the old table

            rooms.forEach(room => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${room.roomId}</td>
                    <td>${room.roomName}</td>
                    // <td>${room.seatCount}</td>
                    <td>
                        <button class="btn btn-warning" onclick="showRoomDetails(${room.roomId})">Chi Tiết</button>
                        <button class="btn btn-danger" onclick="deleteRoom(${room.roomId})">Xóa</button>
                    </td>
                `;
                roomTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById("searchButton").addEventListener("click", function() {
    const name = document.getElementById("searchInput").value;
    searchRoomByName(name);
});

function showRoomDetails(roomId = null) {
    const roomIdInput = document.getElementById("roomId");
    const roomName = document.getElementById("roomName");
    // const seatCount = document.getElementById("seatCount");
    const cinemaId = document.getElementById("cinemaId");

    if (roomId) {
        fetch(`${BASE_ROOM_URL}/${roomId}`)
            .then(response => response.json())
            .then(room => {
                roomIdInput.value = room.roomId;
                roomName.value = room.roomName;
                // seatCount.value = room.seatCount;
                cinemaId.value = room.cinemaId;
            })
            .catch(error => console.error('Error:', error));
    } else {
        roomIdInput.value = "";
        roomName.value = "";
        seatCount.value = "";
        cinemaId.value = "";
    }

    const roomModal = document.getElementById("roomModal");
    roomModal.style.display = "block";
}

function saveRoom(event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    const roomId = document.getElementById("roomId").value; // Get hidden ID field
    const roomName = document.getElementById("roomName").value;
    const seatCount = document.getElementById("seatCount").value;
    const cinemaId = document.getElementById("cinemaId").value;

    // Prepare the room data object
    const roomData = {
        roomName,
        seatCount,
        cinemaId
    };

    let method = "POST";
    let url = `${BASE_ROOM_URL}/create`; // Default to POST (create new)

    if (roomId) { // If ID exists, perform update
        method = "PUT";
        url = `${BASE_ROOM_URL}/${roomId}`;
    }

    // Send the request
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(roomData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(() => {
            fetchRooms(); // Refresh the rooms list
            closeModal(); // Close the modal
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
}

function deleteRoom(roomId) {
    if (confirm("Bạn có chắc chắn muốn xóa phòng chiếu này?")) {
        fetch(`${BASE_ROOM_URL}/${roomId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(() => {
                fetchRooms();
            })
            .catch(err => {
                alert("Lỗi: " + err.message);
            });
    }
}

function closeModal() {
    const roomModal = document.getElementById("roomModal");
    roomModal.style.display = "none";
}

// Add event listener for form submission
document.getElementById("roomForm").addEventListener('submit', saveRoom);

document.addEventListener('DOMContentLoaded', () => {
    fetchRooms();
});