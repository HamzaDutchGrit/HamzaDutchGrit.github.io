document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Verwijder de userId uit sessionStorage
            sessionStorage.removeItem('userId');
            // Verwijder de token uit sessionStorage
            sessionStorage.removeItem('token');
            // Redirect naar de login pagina
            window.location.href = '../portal/login.html'; // Pas het pad aan indien nodig
        });
    }
});