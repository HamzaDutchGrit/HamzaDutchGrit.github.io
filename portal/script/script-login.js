document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const h2 = document.querySelector('h2');
    const signupText = document.querySelector('.signup-text');
    const spin = document.querySelector('.spin');
    const token = sessionStorage.getItem('token'); // Check if there's a token

    if (token) {
        // If the user is logged in
        if (loginForm) {
            loginForm.style.display = 'none'; // Hide the login form
        }

        if (h2) {
            h2.style.display = 'none'; // Hide the h2 element if it exists
        }
        
        if (signupText) {
            signupText.style.display = 'none'; // Hide the signup text if it exists
        }

        if (spin) {
            spin.style.display = 'block'; // Show the loading spinner
        }
    } else {
        // If the user is not logged in
        if (spin) {
            spin.style.display = 'none'; // Hide the spinner
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');
    const goodMsg = document.getElementById('good-msg');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Check if the user is already logged in
    const token = sessionStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
            const isAdmin = decodedToken.IsAdmin === "True";

            // Check if checkout flag is true
            const checkout = sessionStorage.getItem('checkout') === "true";

            if (checkout) {
                // Redirect to contact page if checkout is true
                sessionStorage.setItem('checkout', 'false'); // Set checkout flag to false
                window.location.href = 'webshop/contact%20information%20order.html'; // Redirect to the correct page
                return; // Stop further execution
            }

            // Redirect based on isAdmin value
            if (isAdmin) {
                window.location.href = '../portal/admin.html'; // Go to admin portal
            } else {
                // Ensure the user doesn't go to the portal if not an admin
                if (window.location.pathname !== '/portal/portal.html') {
                    window.location.href = '../portal/portal.html'; // Go to the normal portal
                }
            }
            return; // Stop here so the login form won't be loaded
        } catch (e) {
            console.error('Error decoding the token:', e);
            sessionStorage.removeItem('token'); // Remove token if there's an error
        }
    }

    // Populate the email field if it was previously saved
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }

    // Show the login form if the user is not logged in
    if (loginForm) {
        loginForm.style.display = 'block'; // Show the login form
    }

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        hideMessage(errorMsg);
        hideMessage(goodMsg);

        // Check if all fields are filled
        if (!email || !password) {
            showMessage(errorMsg, 'Please fill in all fields.');
            return;
        }

        const data = { email, password };

        try {
            showMessage(goodMsg, 'Logging in...');

            const response = await fetch('http://login-api-psno.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            hideMessage(goodMsg);

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful:', result);

                const token = result.accessToken; // Get the token from the response
                sessionStorage.setItem('token', token); // Store the token in sessionStorage

                // Check if "Remember Me" was checked
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    // Store the email in localStorage
                    localStorage.setItem('email', email);
                } else {
                    // Remove saved email if "Remember Me" is not checked
                    localStorage.removeItem('email');
                }

                // Decode the token to get the payload
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the payload
                const isAdmin = decodedToken.IsAdmin === "True"; // Get the isAdmin value

                showMessage(goodMsg, 'Login successful!');

                // Check if checkout flag is true
                const checkout = sessionStorage.getItem('checkout') === "true";
                if (checkout) {
                    sessionStorage.setItem('checkout', 'false'); // Zet checkout naar false
                    window.location.href = '/webshop/contact%20information%20order.html'; // Gebruik een absoluut pad
                    return; // Stop de verdere uitvoering
                }
                
                // Redirect after successful login
                setTimeout(() => {
                    if (isAdmin) {
                        window.location.href = '../portal/admin.html'; // Go to admin portal
                    } else {
                        window.location.href = '../portal/portal.html'; // Go to normal portal
                    }
                }, 1500);
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

// Function to show a message
function showMessage(element, message) {
    if (element.classList.contains('good-msg')) {
        element.innerHTML = `<i class="material-icons notranslate">check</i> ${message}`;
    } else if (element.classList.contains('error-msg')) {
        element.innerHTML = `<i class="material-icons notranslate">report</i> ${message}`;
    }
    element.style.display = 'block'; // Ensure the message is visible
}

// Function to hide a message
function hideMessage(element) {
    element.style.display = 'none'; // Hide the message
}

// Function to toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password'); // Get the password field
    const icon = document.querySelector(".toggle-password i"); // Get the icon element

    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Change to text to show password
        icon.textContent = "visibility"; // Change icon to "visible"
    } else {
        passwordInput.type = "password"; // Change back to password to hide it
        icon.textContent = "visibility_off"; // Change icon to "hidden"
    }
}
