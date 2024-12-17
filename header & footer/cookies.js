const cookieBox = document.querySelector(".cookie-wrapper"),
    acceptButton = document.querySelector("#acceptBtn"),
    infoButton = document.querySelector("#infoBtn"),
    anonymousButton = document.querySelector("#anonymousBtn"),
    fullFunctionButton = document.querySelector("#fullFunctionBtn"),
    popupOverlay = document.querySelector("#popupOverlay"),
    closePopup = document.querySelector("#closePopup");

// Function to hide popup
const hidePopup = () => {
    popupOverlay.style.display = "none"; // Close popup
};

// Function to set cookies
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

// Function to get cookie by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// Execute functions when the page is loaded
const executeCodes = () => {
    const cookieConsent = getCookie("cookieConsent");

    // Show the cookie box if no cookie or rejected
    if (!cookieConsent || cookieConsent === "rejected") {
        cookieBox.classList.add("show");
    }

    // Accept button: set cookie and hide cookie box
    acceptButton.addEventListener("click", () => {
        setCookie("cookieConsent", "accepted", 30); // Save consent for 30 days
        cookieBox.classList.remove("show"); // Hide cookie box
    });

    // Show settings popup when 'Info & settings' is clicked
    infoButton.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });

    // Handle anonymous browsing option
    anonymousButton.addEventListener("click", () => {
        setCookie("cookieConsent", "rejected", 30); // Reject cookies for 30 days
        hidePopup(); // Hide popup
        cookieBox.classList.remove("show"); // Hide cookie box
    });

    // Fully functioning website option: accept cookies
    fullFunctionButton.addEventListener("click", () => {
        setCookie("cookieConsent", "accepted", 30); // Accept cookies for 30 days
        hidePopup(); // Hide popup
        cookieBox.classList.remove("show"); // Hide cookie box
    });

    // Close popup on clicking close button
    closePopup.addEventListener("click", hidePopup);

    // Close popup when clicking outside the box
    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });
};

// Run the script when the page is fully loaded
window.addEventListener("load", executeCodes);

// Handle privacy info link to show popup
document.addEventListener("DOMContentLoaded", () => {
    const infoprivacy = document.getElementById("infoprivacy");
    
    infoprivacy.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });
});
