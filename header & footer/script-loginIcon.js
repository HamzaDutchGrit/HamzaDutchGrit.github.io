document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
    const userIconSymbol = document.getElementById("user-icon-symbol"); // Get the user icon element
    const dropdown = document.getElementById("user-dropdown"); // Get the dropdown element
    const portalLink = document.getElementById("portal-link"); // Get the portal link element

    // Initially hide the dropdown and set opacity to 1
    dropdown.style.display = "none"; 
    dropdown.style.opacity = "1"; 

    if (token) {
        try {
            // Decode the token payload and check if the user is an admin
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isAdmin = payload.IsAdmin === "True";

            // Set the user icon to a registration symbol
            userIconSymbol.textContent = "how_to_reg"; 

            // Set the portal link text and URL based on whether the user is an admin
            portalLink.textContent = isAdmin ? "Admin Portal" : "Portal";
            portalLink.href = isAdmin ? "../portal/admin.html" : "../portal/portal.html"; 
        } catch (error) {
            console.error("Error decoding the token:", error); // Log any decoding errors
        }
    } else {
        // Set the user icon to a person icon if no token is found
        userIconSymbol.textContent = "person"; 
    }
});

// Function to toggle the visibility of the dropdown
function toggleDropdown() {
    const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
    const dropdown = document.getElementById("user-dropdown"); // Get the dropdown element

    console.log("Dropdown clicked"); // Debugging: log that the dropdown was clicked
    console.log("Token:", token); // Log the token to the console

    if (!token) {
        console.log("No token found, redirecting to login."); // Debugging: log that the user is being redirected
        window.location.href = "../portal/login.html"; // Redirect the user to the login page if no token is found
    } else {
        // Toggle the visibility of the dropdown with a fade effect
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            dropdown.style.display = "block"; // Make the dropdown visible
            setTimeout(() => {
                dropdown.style.opacity = "1"; // Set opacity to 1 to show the dropdown
            }, 10); // Small delay for transition effect
        } else {
            dropdown.style.opacity = "0"; // Set opacity to 0 to hide the dropdown
            setTimeout(() => {
                dropdown.style.display = "none"; // Hide the dropdown after the transition
            }, 300); // Match the transition duration
        }
        console.log("Dropdown displayed:", dropdown.style.display); // Debugging: log the dropdown display status
    }
}

// Function to log out the user
function logout() {
    sessionStorage.removeItem("token"); // Remove the token from sessionStorage
    window.location.href = "../portal/login.html"; // Redirect the user to the login page
}
