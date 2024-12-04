const LOCATION_API_URL = "http://localhost:8080/api/locations/all";
const menuListItems = document.getElementById("menu-list-items");

// Assuming the button is already on the page with id 'cinema-name'
const cinemaNameButton = document.getElementById("menu-list");

// Track the default cinemaId (if no cinema is selected, it's set to 1)
let selectedCinemaId = 1;  // default to cinemaId = 1, adjust based on your actual default
// const defaultCinemaId = 1;
// Hàm fetch dữ liệu từ API
async function fetchLocationsAndCinemas() {
    try {
        const response = await fetch(LOCATION_API_URL);
        if (!response.ok) throw new Error("Failed to fetch locations data");
        const locations = await response.json();

        for (const location of locations) {
            await fetchCinemasByLocation(location);
        }

        await setDefaultCinemaName();

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

function generateMenu(city, cinemas) {
    // Create a 1st-level dropdown item (city)
    const locationItem = document.createElement("li");
    locationItem.classList.add("dropdown-submenu");

    const locationLink = document.createElement("a"); // Change div to a (anchor tag)
    locationLink.classList.add("dropdown-item", "dropdown-toggle");
    locationLink.innerText = city;
    locationLink.setAttribute("href", "#");
    locationLink.setAttribute("data-bs-toggle", "dropdown");  // Ensure this triggers dropdown toggle
    locationItem.appendChild(locationLink);

    // Create the 2nd-level dropdown menu (cinemas)
    const cinemaList = document.createElement("ul");
    cinemaList.classList.add("dropdown-menu");

    for (const cinema of cinemas) {
        const cinemaItem = document.createElement("li");
        const cinemaLink = document.createElement("a");
        cinemaLink.classList.add("dropdown-item");
        cinemaLink.href = `/home.htm?cinemaId=${cinema.cinemaId}`;  // Change this to `#` so no page reloads
        cinemaLink.innerText = cinema.cinemaName;
        cinemaLink.addEventListener("click", function () {
            // Set the selected cinemaId and update the button title
            selectedCinemaId = cinema.cinemaId;
            // alert(defaultCinemaId === selectedCinemaId);
            updateCinemaNameButton(cinema.cinemaName); // Update button with the selected cinema name
        });
        cinemaItem.appendChild(cinemaLink);
        cinemaList.appendChild(cinemaItem);
    }

    // Append the 2nd-level dropdown to the first-level menu
    locationItem.appendChild(cinemaList);
    document.getElementById("menu-list-items").appendChild(locationItem);

    // Reapply dropdown behavior for dynamically added submenu
    attachDropdownBehavior();
}

// Add behavior for dropdown-submenu
function attachDropdownBehavior() {
    const dropdownSubmenus = document.querySelectorAll(".dropdown-submenu");
    dropdownSubmenus.forEach((submenu) => {
        submenu.addEventListener("mouseenter", function () {
            const submenuDropdown = submenu.querySelector(".dropdown-menu");
            submenuDropdown.classList.add("show");
        });
        submenu.addEventListener("mouseleave", function () {
            const submenuDropdown = submenu.querySelector(".dropdown-menu");
            submenuDropdown.classList.remove("show");
        });
    });
}

// Function to update the button's text with the selected cinema's name
function updateCinemaNameButton(cinemaName) {
    cinemaNameButton.innerText = cinemaName;  // Set the button text to the selected cinema's name
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ensure the second-level dropdown opens to the right */
        .dropdown-submenu {
            position: relative;
        }

        .dropdown-submenu .dropdown-menu {
            top: 0;
            left: 100%;
            margin-left: 0;
            margin-top: -1px; /* Adjust if necessary */
            display: none; /* Hide submenu initially */
        }

        .dropdown-submenu:hover .dropdown-menu {
            display: block; /* Show submenu on hover */
        }
    `;
    document.head.appendChild(style);
}

async function setDefaultCinemaName() {
    // Get the cinemaId from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cinemaIdFromUrl = urlParams.get('cinemaId');

    // Use cinemaId from URL if it exists, otherwise fallback to selectedCinemaId
    const cinemaIdToUse = cinemaIdFromUrl ? cinemaIdFromUrl : selectedCinemaId;

    const defaultCinemaUrl = `http://localhost:8080/api/cinemas/${cinemaIdToUse}`;

    try {
        const response = await fetch(defaultCinemaUrl);
        if (!response.ok) throw new Error("Failed to fetch default cinema");
        const cinema = await response.json();
        updateCinemaNameButton(cinema.cinemaName);  // Update the button with the cinema name
    } catch (error) {
        console.error("Error fetching default cinema:", error);
        cinemaNameButton.innerText = "Choose Cinema";  // Fallback text in case of error
    }
}


// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    attachDropdownBehavior(); // Apply dropdown behavior to already loaded submenus
    addCustomStyles(); // Add custom styles for the dropdown
    fetchLocationsAndCinemas(); // Fetch data and generate the menu
});
