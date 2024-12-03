document.addEventListener("DOMContentLoaded", function () {
    const menuList = document.getElementById("menu-list");
    const LOCATION_API_URL = "http://localhost:8080/api/locations/all";

    // Hàm fetch dữ liệu từ API
    async function fetchLocationsAndCinemas() {
        try {
            const response = await fetch(LOCATION_API_URL);
            if (!response.ok) throw new Error("Failed to fetch locations data");
            const locations = await response.json();

            for (const location of locations) {
                await fetchCinemasByLocation(location);
            }
        } catch (error) {
            console.error("Error fetching locations and cinemas:", error);
        }
    }

    // Hàm fetch danh sách rạp theo locationId
    async function fetchCinemasByLocation(location) {
        try {
            const CINEMA_API_URL = `http://localhost:8080/api/locations/${location.locationId}/cinemas`;
            const response = await fetch(CINEMA_API_URL);
            if (!response.ok) throw new Error(`Failed to fetch cinemas for location ${location.city}`);
            const cinemas = await response.json();

            generateMenu(location.city, cinemas); // Tạo menu cho location này
        } catch (error) {
            console.error("Error fetching cinemas for location:", location.city, error);
        }
    }

    // Hàm tạo menu động cho một location
    function generateMenu(locationName, cinemas) {
        const provinceLi = document.createElement("li");
        provinceLi.classList.add("dropdown-submenu"); // Bootstrap sub-menu

        // Tạo tiêu đề tỉnh/thành phố
        const provinceLink = document.createElement("a");
        provinceLink.classList.add("dropdown-item");
        provinceLink.textContent = locationName;
        provinceLink.href = "#";
        provinceLi.appendChild(provinceLink);

        // Tạo danh sách rạp
        const cinemaUl = document.createElement("ul");
        cinemaUl.classList.add("dropdown-menu");

        cinemas.forEach((cinema) => {
            const cinemaLi = document.createElement("li");
            const cinemaLink = document.createElement("a");

            cinemaLink.textContent = cinema.cinemaName;
            cinemaLink.href = "#";
            cinemaLink.classList.add("dropdown-item");
            cinemaLink.addEventListener("click", () => {
                ChooseCinema(cinema.cinemaId, cinema.cinemaName);
            });
            cinemaLi.appendChild(cinemaLink);
            cinemaUl.appendChild(cinemaLi);
        });

        provinceLi.appendChild(cinemaUl);
        menuList.appendChild(provinceLi);
    }

    // Hàm xử lý khi chọn rạp
    function ChooseCinema(cinemaId, cinemaName) {
        console.log(`Cinema selected: ${cinemaName} (ID: ${cinemaId || "Unknown"})`);
        // Thêm logic xử lý khi chọn rạp, ví dụ: chuyển trang
    }

    // Fetch dữ liệu khi trang tải
    fetchLocationsAndCinemas();
});
