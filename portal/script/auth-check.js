document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("token");

    // Check if the token exists
    if (token) {
        try {
            // Decode the token and parse the payload
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Check if the token has an expiration date (exp)
            if (payload.exp) {
                // Function to update remaining time and check if the token has expired
                const updateRemainingTime = () => {
                    const currentTime = Math.floor(Date.now() / 1000);
                    const remainingTime = payload.exp - currentTime;

                    // If the token has expired
                    if (remainingTime < 0) {
                        console.log("Token has expired. Redirecting to login screen...");
                        clearInterval(timer);
                        sessionStorage.removeItem("token");
                        window.location.href = "../portal/login.html"; // Redirect to login page
                    }
                };

                // Set an interval to check the remaining time every second
                const timer = setInterval(updateRemainingTime, 1000);
                updateRemainingTime();

                // Check if the user is an admin
                const isAdmin = payload.IsAdmin === "True";

                // Check for store-editor.html page
                if (window.location.pathname.includes("store-editor.html")) {
                    if (!isAdmin) {
                        window.location.href = "../portal/portal.html"; // Redirect if not admin
                    } else {
                        document.querySelector("main").style.opacity = 1; // Access for admin
                    }
                }
                // Check for admin page
                else if (window.location.pathname.includes("admin.html")) {
                    if (isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Access for admin
                    } else {
                        window.location.href = "../portal/portal.html"; // Redirect for non-admin
                    }
                }
                // Check for orders page
                else if (window.location.pathname.includes("orders.html")) {
                    if (!isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Access for regular users
                    } else {
                        window.location.href = "../portal/admin.html"; // Redirect for admin
                    }
                }
                // Check for portal page
                else if (window.location.pathname.includes("portal.html")) {
                    if (!isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Access for non-admin
                    } else {
                        window.location.href = "../portal/admin.html"; // Redirect for admin
                    }
                }
            } else {
                console.error("Token does not have an expiration date (exp) set.");
                window.location.href = "../portal/login.html"; // Invalid token
            }
        } catch (error) {
            console.error("Invalid token:", error);
            window.location.href = "../portal/login.html"; // Invalid token
        }
    } else {
        console.warn("No token found.");
        window.location.href = "../portal/login.html"; // No token
    }
});
