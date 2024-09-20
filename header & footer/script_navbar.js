// Menu Toggle for Mobile
document.querySelector('.nav-bar-menu-icon').addEventListener('click', function() { // checks if the menu button is pressed
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('expanded');

    // Toggle Menu Icon
    const menuIcon = document.querySelector('.nav-bar-menu-icon span');
    if (navbar.classList.contains('expanded')) {
        menuIcon.textContent = 'close'; // Change to 'X'
    } else {
        menuIcon.textContent = 'menu'; // Change back to 'menu'
    }
});
