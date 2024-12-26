// document.querySelector("#register form").addEventListener("submit", async function (event) {
//     event.preventDefault(); // Ngăn chặn form nạp lại trang
//
//     // Thu thập dữ liệu từ form
//     const name = document.querySelector("#name").value.trim();
//     const email = document.querySelector("#email-register").value.trim();
//     const password = document.querySelector("#password-register").value.trim();
//     const confirmPassword = document.querySelector("#confirm-password").value.trim();
//     const birthdate = document.querySelector("#birthdate").value;
//     const gender = document.querySelector("#gender").value;
//     const phone = document.querySelector("#phone").value.trim();
//     const captcha = document.querySelector("#captcha").value.trim();
//     const termsAccepted = document.querySelector("#terms").checked;
//
//     // Kiểm tra dữ liệu đầu vào
//     if (!name || !email || !password || !confirmPassword || !birthdate || !phone || !captcha) {
//         alert("Vui lòng điền đầy đủ các trường bắt buộc.");
//         return;
//     }
//
//     if (password !== confirmPassword) {
//         alert("Mật khẩu và xác nhận mật khẩu không khớp.");
//         return;
//     }
//
//     if (!termsAccepted) {
//         alert("Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật.");
//         return;
//     }
//
//     // Dữ liệu gửi đến API
//     const requestData = {
//         name,
//         email,
//         password,
//         birthdate,
//         gender,
//         phone,
//     };
//
//     try {
//         // Gửi yêu cầu đến API
//         const response = await fetch("http://localhost:8080/api/auth/register", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(requestData)
//         });
//
//         // Xử lý phản hồi từ API
//         if (response.ok) {
//             const data = await response.json();
//
//
//             alert("Đăng ký thành công!");
//             location.href = `/dangkithanhvien.htm`;
//         } else {
//             const error = await response.json();
//             alert(`Đăng ký thất bại: ${error.message || "Lỗi không xác định."}`);
//         }
//     } catch (error) {
//         console.error("Lỗi:", error);
//         alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
//     }
// });
document.querySelector("#register form")?.addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn chặn form tự động tải lại trang

    // Thu thập dữ liệu từ form
    const name = document.querySelector("#name")?.value.trim();
    const email = document.querySelector("#email-register")?.value.trim();
    const password = document.querySelector("#password-register")?.value.trim();
    const confirmPassword = document.querySelector("#confirm-password")?.value.trim();
    const birthdate = document.querySelector("#birthdate")?.value;
    const gender = document.querySelector("#gender")?.value.trim().toUpperCase(); // Chuyển thành chữ in hoa
    const phone = document.querySelector("#phone")?.value.trim();
    const captcha = document.querySelector("#captcha")?.value.trim();
    const termsAccepted = document.querySelector("#terms")?.checked;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password || !confirmPassword || !birthdate || !phone || !captcha) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
    }

    if (!termsAccepted) {
        alert("Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật.");
        return;
    }

    // Kiểm tra giá trị hợp lệ của gender
    if (!["MALE", "FEMALE", "OTHERS"].includes(gender)) {
        alert("Giới tính không hợp lệ. Vui lòng chọn MALE, FEMALE hoặc OTHERS.");
        return;
    }

    // Tạo dữ liệu gửi đến API
    const requestData = {
        name,
        email,
        password,
        birthdate,
        gender,
        phone,
    };

    try {
        // Gửi yêu cầu đến API
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            // Nếu backend trả về Long, phản hồi sẽ là một số
            const userId = await response.text(); // Sử dụng `text()` thay vì `json()`
            console.log("User ID:", userId);

            alert(`Đăng ký thành công!`);
            location.href = `/home.htm?userId=${userId}`; // Điều hướng sang trang khác với `userId`
        } else {
            const errorText = await response.text();
            console.error("Lỗi từ máy chủ:", errorText);
            alert("Đăng ký thất bại: " + errorText);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    }
});
