// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};

// ===============Quản lý người dùng==========================
const apiUrl = 'http://localhost:8080/api/users/all';
let userList = [];

// Hàm hiển thị danh sách phim trong bảng
function renderUserTable(users) {
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = ''; // Xóa dữ liệu cũ trong bảng

    users.forEach(user => {
        const row = document.createElement('tr');

        // Tạo và thêm các ô vào hàng
        const idCell = document.createElement('td');
        idCell.textContent = user.userId;
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = user.username;
        row.appendChild(nameCell);

        const directorCell = document.createElement('td');
        directorCell.textContent = user.email;
        row.appendChild(directorCell);

        const actorCell = document.createElement('td');
        actorCell.textContent = user.phone;
        row.appendChild(actorCell);

        const durationCell = document.createElement('td');
        durationCell.textContent = `${user.membershipType} `;
        row.appendChild(durationCell);

        const viewsCell = document.createElement('td');
        viewsCell.textContent = user.address;
        row.appendChild(viewsCell);

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `
            <button onclick="viewUserDetails(${user.userId})">Chi Tiết</button>
            <button onclick="deleteUser(${user.userId})">Xóa</button>
            
        `;
        row.appendChild(actionCell);
        userTable.appendChild(row);
    });
}


// let filteredusers = [];
// Function to fetch users from the API
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Không thể tải dữ liệu người dùng");
        userList = await response.json();
        // filteredusers = userList;
        renderUserTable(userList);
        // filterUsers(filteredusers)
    } catch (error) {
        alert(error.message);
    }
}
// Call the fetchusers function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});
function filterUsers(users) {
    const filterType = document.getElementById('filterSelect').value;

    const currentDate = new Date();

    // Lọc dữ liệu dựa trên loại lọc
    switch (filterType) {
        case 'new':
            filteredusers = userList.filter(user => {
                const releaseDate = new Date(user.userReleaseDate);
                return (
                    releaseDate <= currentDate &&
                    (currentDate - releaseDate) / (1000 * 60 * 60 * 24) <= 30 // Trong 30 ngày gần đây
                );
            });
            break;
        case 'upcoming':
            filteredusers = userList.filter(user => {
                const releaseDate = new Date(user.userReleaseDate);
                return releaseDate > currentDate; // Chưa phát hành
            });
            break;
        case 'mostViewed':
            filteredusers = [...allusers].sort((a, b) => (b.userViews || 0) - (a.userViews || 0)); // Sắp xếp theo lượt xem giảm dần
            break;
        default:
            filteredusers = userList; // Hiển thị tất cả
    }
}


// Call the fetchusers function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});
const searchApi = 'http://localhost:8080/api/users/search';

// Lắng nghe sự kiện click vào nút tìm kiếm
document.getElementById("searchButton").addEventListener("click", async () => {
    // Lấy giá trị từ ô input
    const query = document.getElementById("searchInput").value.trim();

    // Kiểm tra nếu ô input không rỗng
    if (query) {
        try {
            // Gửi yêu cầu tìm kiếm đến API
            const response = await fetch(`http://localhost:8080/api/users/search/${query}`);

            // Kiểm tra trạng thái phản hồi từ API
            if (response.ok) {
                const users = await response.json(); // Chuyển đổi phản hồi thành JSON

                // Gọi hàm hiển thị dữ liệu trong bảng
                populateUserTable(users);
            } else {
                console.error("Error fetching users:", response.statusText);
                alert("Không tìm thấy người dùng nào phù hợp.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.");
        }
    } else {
        alert("Vui lòng nhập từ khóa tìm kiếm.");
    }
});

// Hàm hiển thị dữ liệu trong bảng
function populateUserTable(users) {
    const userTable = document.getElementById("userTable");

    // Xóa dữ liệu cũ trong bảng
    userTable.innerHTML = "";

    // Kiểm tra nếu không có phim nào trả về
    if (users.length === 0) {
        userTable.innerHTML = "<tr><td colspan='8'>Không tìm thấy phim nào.</td></tr>";
        return;
    }

    // Duyệt qua danh sách  và thêm vào bảng
    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.userId}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.membershipType}</td>
            <td>${user.address}</td>
            <td>
                <button onclick="viewUserDetails(${user.userId})">Chi tiết</button>
                <button class="delete-btn" onclick="deleteUser(${user.userId})">Xóa</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}

// Hàm sửa phim
async function editUser(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (response.ok) {
            const user = await response.json();
            // Gán dữ liệu vào modal
            document.getElementById('userId').value = user.userId;
            document.getElementById('userName').value = user.username;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userAddress').value = user.address;
            document.getElementById('userBirthday').value = user.birthday;
            document.getElementById('userGender').value = user.gender;
            document.getElementById('userCreatedAt').value = user.createdAt;
            document.getElementById('userMembership').value = user.membershipType;

            // Hiển thị modal
            const modal = document.getElementById('userModal');
            modal.style.display = 'block';
        } else {
            alert("Không thể lấy thông tin chi tiết người dùng.");
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Có lỗi xảy ra.");
    }
}

async function saveUser(userId) {
    try {
        const updatedUser = {
            username: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            birthday: document.getElementById('userBirthday').value,
            gender: document.getElementById('userGender').value,
            createdAt: document.getElementById('userCreatedAt').value,
            membershipType: document.getElementById('userMembership').value,
            address: document.getElementById('userAddress').value,
        };

        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            alert("Cập nhật phim thành công!");
            closeEditModal();
            loadUsers(); // Tải lại danh sách phim
        } else {
            alert("Cập nhật phim thất bại.");
        }
    } catch (error) {
        console.error("Error saving user:", error);
        alert("Có lỗi xảy ra khi lưu thông tin phim.");
    }
}

// Hàm xóa phim
async function deleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Xóa thành công!");
                location.reload(); // Làm mới bảng sau khi xóa
            } else {
                alert("Không thể xóa phim.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Có lỗi xảy ra.");
        }
    }
}


async function viewUserDetails(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (response.ok) {
            const user = await response.json();
            // Gán dữ liệu vào các input trong modal
            document.getElementById('userId').value = user.userId;
            document.getElementById('userName').value = user.username;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPhone').value = user.phone;
            document.getElementById('userBirthday').value = user.birthday.split("T")[0];
            document.getElementById('userGender').value = user.gender;
            document.getElementById('userAddress').value = user.address;
            document.getElementById('userCreatedAt').value = user.createdAt.split("T")[0];
            document.getElementById('userMembership').value = user.membershipType;

            // Hiển thị modal
            const modal = document.getElementById('userModal');
            modal.style.display = 'block';
        } else {
            alert("Không thể lấy thông tin chi tiết phim.");
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Có lỗi xảy ra.");
    }
}

// document.getElementById('saveButton').addEventListener('click', async () => {
//     const userId = document.getElementById('userId').value;
//     const updatedUser = {
//         username: document.getElementById('userName').value,
//         email: document.getElementById('userEmail').value,
//         phone: document.getElementById('userPhone').value,
//         birthday: document.getElementById('userBirthday').value,
//         genre: document.getElementById('userGenre').value,
//         createdAt: document.getElementById('userCreatedAt').value,
//         membershipType: document.getElementById('userMembership').value,
//         address: document.getElementById('userAddress').value,
//     };
//
//     try {
//         const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updateduser)
//         });
//
//         if (response.ok) {
//             alert("Cập nhật thành công!");
//             location.reload();
//         } else {
//             alert("Không thể cập nhật phim.");
//         }
//     } catch (error) {
//         console.error("Error updating user:", error);
//         alert("Có lỗi xảy ra.");
//     }
// });

document.getElementById('deleteButton').addEventListener('click', async () => {
    const userId = document.getElementById('userId').value;

    if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Xóa thành công!");
                location.reload();
            } else {
                alert("Không thể xóa người dùng.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Có lỗi xảy ra.");
        }
    }
});

document.querySelector('.close').addEventListener('click', () => {
    const modal = document.getElementById('userModal');
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('userModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


