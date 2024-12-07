document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra trạng thái người dùng
    function checkUserStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        console.log("User ID from URL:", userId);  // Kiểm tra giá trị userId

        // Lấy phần tử đăng ký thành viên
        const registerLink = document.querySelector('.nav-link.register');
        const registerText = registerLink.querySelector('span');

        if (userId != null) {
            registerLink.href = `/thongtinthanhvien.htm?userId=${userId}`;  // Đổi đường dẫn nếu có userId
            registerText.textContent = 'Thông tin thành viên';  // Đổi text hiển thị thành "Thông tin thành viên"
        } else {
            registerLink.href = '/dangkithanhvien.htm';  // Đường dẫn đăng ký thành viên
            registerText.textContent = 'Đăng ký thành viên';  // Hiển thị text đăng ký thành viên
        }
    }

    // Gọi hàm kiểm tra trạng thái người dùng khi trang tải xong
    checkUserStatus();
});
