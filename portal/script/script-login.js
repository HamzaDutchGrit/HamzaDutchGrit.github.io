document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const h2 = document.querySelector('h2'); // Het h2-element ophalen
    const signupText = document.querySelector('.signup-text'); // Het p-element met de class signup-text ophalen
    const spin = document.querySelector('.spin'); // De spin ophalen
    const token = sessionStorage.getItem('token'); // Hier wordt gekeken of er een token is

    if (token) {
        // Als de gebruiker is ingelogd
        if (loginForm) {
            loginForm.style.display = 'none'; // Verberg het loginformulier
        }

        if (h2) {
            h2.style.display = 'none'; // Verberg het h2-element als het bestaat
        }
        
        if (signupText) {
            signupText.style.display = 'none'; // Verberg het signup tekst element als het bestaat
        }

        if (spin) {
            spin.style.display = 'block'; // Toon de spin
        }
    } else {
        // Als de gebruiker niet is ingelogd
        if (spin) {
            spin.style.display = 'none'; // Verberg de spin
        }
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');
    const goodMsg = document.getElementById('good-msg');
    const rememberMeCheckbox = document.getElementById('remember-me');

    
    // Controleer of de gebruiker al is ingelogd
    const token = sessionStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodeer de token
            const isAdmin = decodedToken.IsAdmin === "True";

            // Redirect naar de juiste pagina op basis van isAdmin
            if (isAdmin) {
                window.location.href = '../portal/admin.html'; // Ga naar de admin portal
            } else {
                // Zorg ervoor dat de gebruiker niet naar de portal gaat als hij niet admin is
                if (window.location.pathname !== '/portal/portal.html') {
                    window.location.href = '../portal/portal.html'; // Ga naar de normale portal
                }
            }
            return; // Stop hier, zodat het inlogformulier niet verder wordt geladen
        } catch (e) {
            console.error('Error decoding the token:', e);
            sessionStorage.removeItem('token'); // Verwijder de token als er een fout is
        }
    }

    // Vul het e-mailadres in als het eerder is opgeslagen
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }

    // Toon het loginformulier als de gebruiker niet is ingelogd
    if (loginForm) {
        loginForm.style.display = 'block'; // Toon het formulier als de gebruiker niet is ingelogd
    }

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Voorkom standaard form submission

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        hideMessage(errorMsg);
        hideMessage(goodMsg);

        // Controleer of alle velden ingevuld zijn
        if (!email || !password) {
            showMessage(errorMsg, 'Please fill in all fields.');
            return;
        }

        const data = { email, password };

        try {
            showMessage(goodMsg, 'Logging in...');

            const response = await fetch('https://localhost:7190/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            hideMessage(goodMsg);

            if (response.ok) {
                const result = await response.json();
                console.log('Login succesvol:', result);

                const token = result.accessToken; // Verkrijg de token van de response
                sessionStorage.setItem('token', token); // Sla de token op in de sessionStorage

                // Controleer of de gebruiker "Remember Me" heeft aangevinkt
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    // Sla het e-mailadres op in localStorage
                    localStorage.setItem('email', email);
                } else {
                    // Verwijder het opgeslagen e-mailadres uit localStorage als het niet aangevinkt is
                    localStorage.removeItem('email');
                }

                // Decodeer de token om de payload te krijgen
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodeer de payload
                const isAdmin = decodedToken.IsAdmin === "True"; // Verkrijg de isAdmin waarde

                showMessage(goodMsg, 'Login successful!');

                // Redirect naar de juiste pagina na succesvol inloggen
                if (isAdmin) {
                    setTimeout(() => {
                        window.location.href = '../portal/admin.html'; // Ga naar de admin portal
                    }, 1500);
                } else {
                    setTimeout(() => {
                        window.location.href = '../portal/portal.html'; // Ga naar de normale portal
                    }, 1500);
                }
            } else {
                let errorMessage = 'Email or password is incorrect.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error('Could not parse the error message:', e);
                }

                showMessage(errorMsg, errorMessage);
            }
        } catch (error) {
            console.error('An error occurred while logging in:', error);
            showMessage(errorMsg, 'There is a problem with the server. Please try again later.');
        }
    });
});

/**
 * Functie om een bericht te tonen
 * @param {HTMLElement} element - Het element dat getoond moet worden
 * @param {string} message - Het bericht dat getoond moet worden
 */
function showMessage(element, message) {
    if (element.classList.contains('good-msg')) {
        element.innerHTML = `<i class="material-icons">check</i> ${message}`;
    } else if (element.classList.contains('error-msg')) {
        element.innerHTML = `<i class="material-icons">report</i> ${message}`;
    }
    element.style.display = 'block'; // Zorg ervoor dat het bericht zichtbaar is
}

/**
 * Functie om een bericht te verbergen
 * @param {HTMLElement} element - Het element dat verborgen moet worden
 */
function hideMessage(element) {
    element.style.display = 'none'; // Verberg het bericht
}

// Functie om wachtwoord zichtbaarheid te toggelen
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password'); // Haal het wachtwoord veld op
    const icon = document.querySelector(".toggle-password i"); // Haal het icoon element op

    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Verander naar tekst om het wachtwoord weer te geven
        icon.textContent = "visibility"; // Verander het icoon naar "zichtbaar"
    } else {
        passwordInput.type = "password"; // Verander terug naar wachtwoord om het te verbergen
        icon.textContent = "visibility_off"; // Verander het icoon naar "verborgen"
    }
}

