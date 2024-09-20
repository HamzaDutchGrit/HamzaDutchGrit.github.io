// Function to toggle the visibility of the password input
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password"); // Get the password input field
    const icon = document.querySelector(".toggle-password i"); // Get the icon element

    // Check the current type of the password input
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Change to text to show the password
        icon.textContent = "visibility"; // Change the icon to "eye"
    } else {
        passwordInput.type = "password"; // Change back to password to hide it
        icon.textContent = "visibility_off"; // Change the icon to "eye with a slash"
    }
}
