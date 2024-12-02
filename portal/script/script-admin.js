function downloadExcel() {
    console.log("Download button clicked"); // Log in de console om te testen

    // Vervang dit door de juiste API-URL
    const apiUrl = "https://login-api-psno.onrender.com/users"; 

    // Haal het Bearer-token op uit de session storage
    const token = sessionStorage.getItem("token"); 

    if (!token) {
        console.error("Geen token gevonden in session storage.");
        return; // Stop de functie als het token niet gevonden is
    }

    // Haal de JSON-data op van de API met de juiste headers
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Voeg de Authorization header toe
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data fetched successfully", data); // Log de data in de console

        // Maak een Excel-werkblad
        const sheet = XLSX.utils.json_to_sheet(data);
        
        // Maak een nieuw werkboek
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "Accounts Database");

        // Zet het om naar een binary bestand
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Maak een Blob voor het downloaden
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Maak een downloadbare link voor het Excel-bestand
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "accounts_db.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Verwijder de link na het klikken
    })
    .catch(error => {
        console.error("Er is een fout opgetreden bij het ophalen van de data:", error);
    });
}

function downloadAnalyticsExcel() {
    console.log("Analytics button clicked"); // Log in de console om te testen

    const apiUrl = "https://login-api-psno.onrender.com/analyticsdb"; // API-URL voor analytics

    const token = sessionStorage.getItem("token"); 

    if (!token) {
        console.error("Geen token gevonden in session storage.");
        return; // Stop de functie als het token niet gevonden is
    }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Voeg de Authorization header toe
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Analytics data fetched successfully", data); // Log de data in de console

        const sheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "Analytics Database");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "analytics_db.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Verwijder de link na het klikken
    })
    .catch(error => {
        console.error("Er is een fout opgetreden bij het ophalen van de analytics data:", error);
    });
}

function downloadStore() {
    console.log("Store DB button clicked"); // Log om te bevestigen dat de knop is geklikt

    const jsonFilePath = "../webshop/script/products.json"; // Pad naar het lokale JSON-bestand

    // Haal de JSON-gegevens op
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Product data fetched successfully", data); // Log de opgehaalde productgegevens

            // Maak een array voor de uiteindelijke producten
            let productsArray = [];

            // Controleer of discipline_group bestaat
            if (data.discipline_group) {
                const disciplines = data.discipline_group;

                // Loop door de discipline groepen
                Object.entries(disciplines).forEach(([discipline, products]) => {
                    // Controleer of products een array is
                    if (Array.isArray(products)) {
                        // Loop door elk product in de groep
                        products.forEach(product => {
                            productsArray.push({
                                id: product.code || '',  // Vul het id veld met de code
                                "Foundation - Basic": discipline === "Foundation - Basic" ? product.product : '',
                                "Foundation - Add. options": discipline === "Foundation - Add. options" ? product.product : '',
                                "Depot Services - Basic": discipline === "Depot Services - Basic" ? product.product : '',
                                "Depot Services - Optimized": discipline === "Depot Services - Optimized" ? product.product : '',
                                "Depot Services - Add. options": discipline === "Depot Services - Add. options" ? product.product : '',
                                "Loaded Services - Basic": discipline === "Loaded Services - Basic" ? product.product : '',
                                "Loaded Services - Optimized": discipline === "Loaded Services - Optimized" ? product.product : '',
                                "Loaded Services - Add. options": discipline === "Loaded Services - Add. options" ? product.product : '',
                                "Cleaning Services - Basic": discipline === "Cleaning Services - Basic" ? product.product : '',
                                "Cleaning Services - Optimized": discipline === "Cleaning Services - Optimized" ? product.product : '',
                                "Cleaning Services - Add. options": discipline === "Cleaning Services - Add. options" ? product.product : '',
                                "M&R Services - Basic": discipline === "M&R Services - Basic" ? product.product : '',
                                "M&R Services - Optimized": discipline === "M&R Services - Optimized" ? product.product : ''
                            });
                        });
                    } else {
                        console.error(`Expected products to be an array but got:`, products);
                    }
                });
            } else {
                console.error("Discipline group not found in the fetched data.");
            }

            // Maak een Excel-werkblad
            const sheet = XLSX.utils.json_to_sheet(productsArray);

            // Pas de kolombreedte aan
            const columnWidths = [
                { width: 15 },  // id
                { width: 30 },  // Foundation - Basic
                { width: 30 },  // Foundation - Add. options
                { width: 30 },  // Depot Services - Basic
                { width: 30 },  // Depot Services - Optimized
                { width: 30 },  // Depot Services - Add. options
                { width: 30 },  // Loaded Services - Basic
                { width: 30 },  // Loaded Services - Optimized
                { width: 30 },  // Loaded Services - Add. options
                { width: 30 },  // Cleaning Services - Basic
                { width: 30 },  // Cleaning Services - Optimized
                { width: 30 },  // Cleaning Services - Add. options
                { width: 30 },  // M&R Services - Basic
                { width: 30 }   // M&R Services - Optimized
            ];

            // Stel de breedtes in voor elke kolom
            sheet["!cols"] = columnWidths;

            // Maak een nieuw werkboek
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet, "Store Database");

            // Zet het werkboek om naar een binary bestand
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Maak een Blob voor het downloaden
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // Maak een downloadbare link voor het Excel-bestand
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "store_db.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Verwijder de link na het klikken
        })
        .catch(error => {
            console.error("Er is een fout opgetreden bij het ophalen van de productdata:", error);
        });
}

function fetchUserName() {
    const apiUrl = "https://login-api-psno.onrender.com/me"; // API-URL voor het ophalen van de gebruikersinformatie
    const token = sessionStorage.getItem("token"); // Haal het token op uit de session storage

    if (!token) {
        console.error("Geen token gevonden in session storage.");
        return; // Stop de functie als er geen token is
    }

    // Haal de gebruikersgegevens op met de juiste headers
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Voeg de Authorization header toe
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Gebruikersdata opgehaald:", data); // Log de opgehaalde gebruikersinformatie

        // Plaats de naam in het "Welcome"-bericht en maak de eerste letter een hoofdletter
        let userName = data.name || "Gebruiker"; // Als er geen naam is, gebruik 'Gebruiker' als fallback
        userName = userName.charAt(0).toUpperCase() + userName.slice(1); // Eerste letter hoofdletter maken

        // Update het welkomstbericht met de geformatteerde naam
        document.getElementById("welcome-message").textContent = `Welcome ${userName}`;
    })
    .catch(error => {
        console.error("Er is een fout opgetreden bij het ophalen van de gebruikersdata:", error);
    });
}

// Roep de functie aan om de gebruikersnaam op te halen zodra de pagina wordt geladen
document.addEventListener("DOMContentLoaded", fetchUserName);
