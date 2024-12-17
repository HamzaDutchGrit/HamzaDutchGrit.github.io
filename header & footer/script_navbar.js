document.querySelector('.nav-bar-menu-icon').addEventListener('click', function() {
    const navbar = document.querySelector('.navbar'); // Select the navbar element
    const userIconContainer = document.querySelector('.user-icon-container'); // Select the user icon container
    const dropdown = document.querySelector('.dropdown'); // Select the dropdown menu
    const menuIcon = document.querySelector('.nav-bar-menu-icon span'); // Select the span inside the menu icon

    // Toggle the navbar expansion
    navbar.classList.toggle('expanded'); // Add or remove the 'expanded' class from the navbar
    menuIcon.textContent = navbar.classList.contains('expanded') ? 'close' : 'menu'; // Change the menu icon text between 'close' and 'menu'

    // Dropdown logic when the navbar is expanded
    if (navbar.classList.contains('expanded')) {
        if (window.innerWidth > 1200) {
            dropdown.style.display = 'block'; // Show the dropdown for larger screens
            dropdown.style.opacity = '1'; // Set opacity to make it visible
        } else {
            dropdown.style.display = 'none'; // Hide the dropdown for smaller screens
        }
        userIconContainer.style.display = 'block'; // Show the user icon container when the navbar is expanded
    } else {
        dropdown.style.opacity = '0'; // Set opacity to 0 when closing the navbar
        setTimeout(() => {
            dropdown.style.display = 'none'; // Hide the dropdown after the opacity transition
        }, 300); // Wait for 300ms (transition duration)
    }
});
