document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("token");

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Controleer of het token een vervaldatum (exp) heeft
            if (payload.exp) {
                // Functie om de resterende tijd te berekenen en in de console te loggen
                const updateRemainingTime = () => {
                    const currentTime = Math.floor(Date.now() / 1000); // Huidige tijd in seconden
                    const remainingTime = payload.exp - currentTime; // Resterende tijd in seconden
                    // console.log(`Resterende tijd voor token: ${remainingTime} seconden`);

                    // Controleer of het token is verlopen
                    if (remainingTime < 0) {
                        // Token is verlopen, gebruiker doorverwijzen naar inlogscherm
                        console.log("Token is verlopen. Doorverwijzen naar inlogscherm...");
                        clearInterval(timer); // Stop de timer
                        window.location.href = "../portal/login.html";
                        sessionStorage.removeItem("token");
                    }
                };

                // Start de timer die elke seconde de resterende tijd bijwerkt
                const timer = setInterval(updateRemainingTime, 1000);
                updateRemainingTime(); // Roep de functie direct aan om de eerste waarde te tonen

                const isAdmin = payload.IsAdmin === "True";

                // Toegang voor admin
                if (window.location.pathname.includes("admin.html")) {
                    if (isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Admin toegang
                    } else {
                        window.location.href = "../portal/portal.html"; // Doorverwijzing voor niet-admin
                    }
                } 
                // Toegang voor normale accounts
                else if (window.location.pathname.includes("orders.html")) {
                    if (!isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Normale account toegang
                    } else {
                        window.location.href = "../portal/admin.html"; // Doorverwijzing voor admin
                    }
                }
                // Toegang voor de portal pagina
                else if (window.location.pathname.includes("portal.html")) {
                    if (!isAdmin) {
                        document.querySelector("main").style.opacity = 1; // Geen admin toegang
                    } else {
                        window.location.href = "../portal/admin.html"; // Doorverwijzing voor admin
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
