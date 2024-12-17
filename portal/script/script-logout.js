document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button'); // Get the logout button element

    if (logoutButton) { // Check if the logout button exists
        logoutButton.addEventListener('click', function () {
            // Remove the userId from sessionStorage when the user clicks logout
            sessionStorage.removeItem('userId');
            
            // Remove the token from sessionStorage to log the user out
            sessionStorage.removeItem('token');
            
            // Redirect the user to the login page after logging out
            window.location.href = '../portal/login.html'; // Adjust the path if necessary
        });
    }
});
