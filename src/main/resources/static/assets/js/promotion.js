const promotionAPI = "http://localhost:8080/api/promotions"; // API endpoint

function searchPromotionByName(name) {
    fetch(`${promotionAPI}/search/${name}`)
        .then(response => response.json())
        .then(promotions => {
            const promotionTable = document.getElementById("promotionTable");
            promotionTable.innerHTML = ''; // Xóa bảng cũ

            promotions.forEach(promotion => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${promotion.promotionId}</td>
                    <td>${promotion.promotionName}</td>
                    <td>${promotion.promotionDescription}</td>
                    <td>${formatDate(promotion.promotionStartDate)}</td>
                    <td>${formatDate(promotion.promotionEndDate)}</td>
                    <td>${promotion.promotionType}</td>
                `;
                promotionTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Gọi hàm tìm kiếm khi nhấn nút
document.getElementById("searchButton").addEventListener("click", function() {
    const name = document.getElementById("searchInput").value;
    searchPromotionByName(name);
});

// Hàm hiển thị Modal
function showModal(promotionId = null) {
    const modal = document.getElementById("promotionModal");
    const modalTitle = document.getElementById("modalTitle");
    const promotionName = document.getElementById("promotionName");
    const promotionDescription = document.getElementById("promotionDescription");
    const promotionStartDate = document.getElementById("promotionStartDate");
    const promotionEndDate = document.getElementById("promotionEndDate");
    const promotionType = document.getElementById("promotionType");
    const promotionIdInput = document.getElementById("promotionId"); // Hidden field for ID

    if (promotionId) {
        // Sửa khuyến mãi
        modalTitle.textContent = "Sửa Khuyến Mãi";
        fetch(`${promotionAPI}/${promotionId}`)
            .then(response => response.json())
            .then(data => {
                promotionName.value = data.promotionName;
                promotionDescription.value = data.promotionDescription;
                promotionStartDate.value = data.promotionStartDate;
                promotionEndDate.value = data.promotionEndDate;
                promotionType.value = data.promotionType;
                promotionIdInput.value = promotionId; // Set hidden ID
            });
    } else {
        // Thêm mới khuyến mãi
        modalTitle.textContent = "Thêm Khuyến Mãi";
        promotionName.value = "";
        promotionDescription.value = "";
        promotionStartDate.value = "";
        promotionEndDate.value = "";
        promotionType.value = "COMBO";
        promotionIdInput.value = ""; // Clear hidden ID
    }

    modal.style.display = "block";
}

// Hàm đóng Modal
function closeModal() {
    const modal = document.getElementById("promotionModal");
    modal.style.display = "none";
}

// Hàm tải danh sách khuyến mãi
function fetchPromotions() {
    fetch(`${promotionAPI}/all`)
        .then(response => response.json())
        .then(promotions => {
            const promotionTable = document.getElementById("promotionTable");
            promotionTable.innerHTML = ''; // Xóa bảng cũ

            promotions.forEach(promotion => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${promotion.promotionId}</td>
                    <td>${promotion.promotionName}</td>
                    <td>${promotion.promotionDescription}</td>
                    <td>${formatDate(promotion.promotionStartDate)}</td>
                    <td>${formatDate(promotion.promotionEndDate)}</td>
                    <td>${promotion.promotionType}</td>
                    <td>
                        <button onclick="showModal(${promotion.promotionId})">Sửa</button>
                        <button onclick="deletePromotion(${promotion.promotionId})">Xóa</button>
                    </td>
                `;
                promotionTable.appendChild(row);
            });
        });
}

// Hàm định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm thêm hoặc sửa khuyến mãi
function savePromotion(event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    const promotionId = document.getElementById("promotionId").value; // Get hidden ID field
    const promotionName = document.getElementById("promotionName").value;
    const promotionDescription = document.getElementById("promotionDescription").value;
    const promotionStartDate = document.getElementById("promotionStartDate").value;
    const promotionEndDate = document.getElementById("promotionEndDate").value;
    const promotionType = document.getElementById("promotionType").value;

    // Prepare the promotion data object
    const promotionData = {
        promotionName,
        promotionDescription,
        promotionStartDate: promotionStartDate ? `${promotionStartDate}T00:00:00` : null, // Convert to ISO format
        promotionEndDate: promotionEndDate ? `${promotionEndDate}T00:00:00` : null,
        promotionType
    };

    let method = "POST";
    let url = `${promotionAPI}/create`; // Default to POST (create new)

    if (promotionId) { // If ID exists, perform update
        method = "PUT";
        url = `${promotionAPI}/${promotionId}`;
    }

    // Send the request
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(promotionData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(() => {
            fetchPromotions(); // Refresh the promotions list
            closeModal(); // Close the modal
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
}

// Hàm xóa khuyến mãi
function deletePromotion(promotionId) {
    if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
        fetch(`${promotionAPI}/${promotionId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(() => {
                fetchPromotions();
            })
            .catch(err => {
                alert("Lỗi: " + err.message);
            });
    }
}

// Lắng nghe sự kiện khi form được submit
document.getElementById("promotionForm").addEventListener('submit', savePromotion);

// Tải danh sách khuyến mãi khi trang được tải
fetchPromotions();
