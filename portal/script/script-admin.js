function downloadExcel() {
    console.log("Download button clicked"); // Log to console for testing

    // Replace this with the correct API URL
    const apiUrl = `${API_URL.accounts}users`; 

    // Retrieve the Bearer token from session storage
    const token = sessionStorage.getItem("token"); 

    if (!token) {
        console.error("No token found in session storage.");
        return; // Stop the function if the token is not found
    }

    // Fetch JSON data from the API with the correct headers
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the Authorization header
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
        console.log("Data fetched successfully", data); // Log the data to console

        // Create an Excel sheet from the fetched data
        const sheet = XLSX.utils.json_to_sheet(data);
        
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "Accounts Database");

        // Convert it to a binary file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create a Blob for downloading
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Create a downloadable link for the Excel file
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "accounts_db.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove the link after clicking
    })
    .catch(error => {
        console.error("An error occurred while fetching data:", error);
    });
}

function downloadAnalyticsExcel() {
    console.log("Analytics button clicked"); // Log to console for testing

    const apiUrl = `${API_URL.accounts}analyticsdb`; // API URL for analytics

    const token = sessionStorage.getItem("token"); 

    if (!token) {
        console.error("No token found in session storage.");
        return; // Stop the function if the token is not found
    }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the Authorization header
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
        console.log("Analytics data fetched successfully", data); // Log the data to console

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
        document.body.removeChild(link); // Remove the link after clicking
    })
    .catch(error => {
        console.error("An error occurred while fetching the analytics data:", error);
    });
}

function downloadStore() {
    console.log("Store DB button clicked"); // Log to confirm the button is clicked

    const jsonFilePath = "../webshop/products.json"; // Path to the local JSON file

    // Fetch the JSON data
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Product data fetched successfully", data); // Log the fetched product data

            // Create an array for the final products
            let productsArray = [];

            // Check if discipline_group exists
            if (data.discipline_group) {
                const disciplines = data.discipline_group;

                // Loop through discipline groups
                Object.entries(disciplines).forEach(([discipline, products]) => {
                    // Check if products is an array
                    if (Array.isArray(products)) {
                        // Loop through each product in the group
                        products.forEach(product => {
                            productsArray.push({
                                id: product.code || '',  // Fill the id field with the code
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

            // Create an Excel sheet
            const sheet = XLSX.utils.json_to_sheet(productsArray);

            // Set the column widths
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

            // Set the column widths for the sheet
            sheet["!cols"] = columnWidths;

            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet, "Store Database");

            // Convert the workbook to a binary file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Create a Blob for downloading
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // Create a downloadable link for the Excel file
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "store_db.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Remove the link after clicking
        })
        .catch(error => {
            console.error("An error occurred while fetching the product data:", error);
        });
}

function fetchUserName() {
    const apiUrl = `${API_URL.accounts}me`; // API URL for fetching user info
    const token = sessionStorage.getItem("token"); // Get the token from session storage

    if (!token) {
        console.error("No token found in session storage.");
        return; // Stop the function if no token is present
    }

    // Fetch user data with the correct headers
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the Authorization header
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
        console.log("User data fetched:", data); // Log the fetched user information

        // Update the welcome message with the user's name, capitalizing the first letter
        let userName = data.name || "User"; // Fallback to 'User' if no name
        userName = userName.charAt(0).toUpperCase() + userName.slice(1); // Capitalize the first letter

        // Update the welcome message on the page
        document.getElementById("welcome-message").textContent = `Welcome ${userName}`;
    })
    .catch(error => {
        console.error("An error occurred while fetching user data:", error);
    });
}

// Call the function to fetch the user name once the page is loaded
document.addEventListener("DOMContentLoaded", fetchUserName);
