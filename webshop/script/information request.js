// Functie om de gebruiker te controleren en door te sturen
function checkLoginAndRedirect() {
    // Haal het token op uit sessionStorage
    const token = sessionStorage.getItem('token');
    
    // Controleer of het token bestaat (de gebruiker is ingelogd)
    if (token) {
        // Gebruiker is ingelogd, doorsturen naar adresinformatie
        window.location.href = '../webshop/contact information order.html';
        console.log("token is true")
    } else {
        // Gebruiker is niet ingelogd, zet 'checkout' op true in sessionStorage
        sessionStorage.setItem('checkout', 'true');
        console.log("geen token")
        // Doorsturen naar de loginpagina
        window.location.href = '../../portal/login.html';
    }
}

