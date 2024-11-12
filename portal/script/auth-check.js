document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("token");

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Controleer of het token een vervaldatum (exp) heeft
            if (payload.exp) {
                const updateRemainingTime = () => {
                    const currentTime = Math.floor(Date.now() / 1000);
                    const remainingTime = payload.exp - currentTime;

                    if (remainingTime < 0) {
                        console.log("Token is verlopen. Doorverwijzen naar inlogscherm...");
                        clearInterval(timer);
                        sessionStorage.removeItem("token");
                        window.location.href = "../portal/login.html";
                    }
                };

                const timer = setInterval(updateRemainingTime, 1000);
                updateRemainingTime();

                const isAdmin = payload.IsAdmin === "True";

                // Check voor store-editor.html pagina
                if (window.location.pathname.includes("store-editor.html")) {
                    if (!isAdmin) {
                        window.location.href = "../portal/portal.html"; // Redirect als geen admin
                    } else {
                        document.querySelector("main").style.opacity = 1; // Toegang voor admin
                    }
                }
                // Check voor admin pagina
                else if (window.location.pathname.includes("admin.html")) {
                    if (isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Toegang voor admin
                    } else {
                        window.location.href = "../portal/portal.html"; // Redirect voor niet-admin
                    }
                }
                // Check voor orders pagina
                else if (window.location.pathname.includes("orders.html")) {
                    if (!isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Toegang voor normale accounts
                    } else {
                        window.location.href = "../portal/admin.html"; // Redirect voor admin
                    }
                }
                // Check voor portal pagina
                else if (window.location.pathname.includes("portal.html")) {
                    if (!isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Toegang voor niet-admin
                    } else {
                        window.location.href = "../portal/admin.html"; // Redirect voor admin
                    }
                }
            } else {
                console.error("Token heeft geen vervaldatum (exp) ingesteld.");
                window.location.href = "../portal/login.html"; // Ongeldig token
            }
        } catch (error) {
            console.error("Ongeldig token:", error);
            window.location.href = "../portal/login.html"; // Ongeldig token
        }
    } else {
        console.warn("Geen token gevonden.");
        window.location.href = "../portal/login.html"; // Geen token
    }
});
