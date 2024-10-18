// Object to store counts for each status
const orderCounts = {
    all: 0,
    completed: 0,
    pending: 0,
    failed: 0
};

// Function to count orders by status
function countOrders() {
    // Reset counts
    for (let key in orderCounts) {
        orderCounts[key] = 0;
    }

    // Count the orders
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('[data-label="Status"]');
        if (statusCell) {
            const statusClass = statusCell.classList.contains('completed') ? 'completed' :
                                statusCell.classList.contains('pending') ? 'pending' :
                                statusCell.classList.contains('failed') ? 'failed' : null;

            // Update counts
            orderCounts.all++;
            if (statusClass) {
                orderCounts[statusClass]++;
            }
        }
    });

    // Update the counters for all tabs
    updateCounters(orderCounts);
}

// Function to filter orders based on the status
function filterOrders(status) {
    // Remove 'active' class from all tabs
    const tabs = document.querySelectorAll('.order-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Add 'active' class to clicked tab
    const activeTab = document.getElementById(status + '-orders');
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Filter orders based on the status
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('[data-label="Status"]');
        if (statusCell) {
            const statusClass = statusCell.classList.contains('completed') ? 'completed' :
                                statusCell.classList.contains('pending') ? 'pending' :
                                statusCell.classList.contains('failed') ? 'failed' : null;

            // Display row based on status match
            row.style.display = (status === 'all' || statusClass === status) ? '' : 'none';
        }
    });
}

// Function to update the counters
function updateCounters(totalCounts) {
    const counters = {
        all: document.querySelector('#all-orders .order-counter'),
        completed: document.querySelector('#completed-orders .order-counter'),
        pending: document.querySelector('#pending-orders .order-counter'),
        failed: document.querySelector('#failed-orders .order-counter'),
    };

    // Update the count for each status
    Object.keys(counters).forEach(key => {
        if (counters[key]) {
            counters[key].textContent = `(${totalCounts[key] || 0})`;
        }
    });
}

// Functie om PDF te genereren op basis van de geselecteerde order
function generatePDF(order) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Titel van de PDF
    doc.setFontSize(40); // Grotere lettergrootte voor de titel
    doc.setTextColor('#60625f'); // Zwart voor de titel
    doc.text('Invoice', 10, 25); // Titelpositie

    // Logo toevoegen met de juiste afmetingen
    const logoUrl = '../media/depotsoftware pdf.webp'; // Zorg ervoor dat dit pad correct is
    const pageWidth = doc.internal.pageSize.getWidth(); // Breedte van de pagina
    const imgWidth = 80; // Stel de gewenste breedte van de afbeelding in
    const imgHeight = 17; // Stel de gewenste hoogte van de afbeelding in
    const xPos = pageWidth - imgWidth - 10; // Zorgt ervoor dat de afbeelding rechts staat met 10px marge
    doc.addImage(logoUrl, 'WEBP', xPos, 10, imgWidth, imgHeight);

    // Voeg ordergegevens toe
    doc.setFontSize(12); // Standaard lettergrootte voor tekst
    doc.setTextColor('#60625f'); // Antraciet voor de ordergegevens
    const orderInfoX = 10; // X-positie voor orderinformatie
    doc.text(`Order Number: ${order.orderNumber}`, orderInfoX, 50);
    doc.text(`Order Date: ${formatDate(order.orderDate)}`, orderInfoX, 60);
    doc.text(`Order Status: ${order.status}`, orderInfoX, 70);
    doc.text(`Total: €${order.total.toFixed(2)} for ${order.quantity} items`, orderInfoX, 80);

    // Contactgegevens aan de rechterkant, hoger geplaatst
    const contactInfoX = (pageWidth / 2) + 15; // X-positie voor contactinformatie
    const contactInfoYStart = 50; // Start Y-positie voor contactinformatie (boven orderinfo)
    doc.setFontSize(12); // Standaard lettergrootte voor contactinformatie
    doc.setTextColor('#60625f'); // Zwart voor de contactgegevens
    doc.text('Contact', contactInfoX, contactInfoYStart);
    doc.text('Email: info@depotsoftware.com', contactInfoX, contactInfoYStart + 10);
    doc.text('Telefoon: +31 88 999 8999', contactInfoX, contactInfoYStart + 20);
    doc.text('Adres: De Zelling 8', contactInfoX, contactInfoYStart + 30);
    doc.text('3342GS Hendrik-Ido-Ambacht', contactInfoX, contactInfoYStart + 40);
    doc.text('The Netherlands', contactInfoX, contactInfoYStart + 50);

    // Beginpositie voor de items
    let yPosition = 120; // Verhoogd naar 150 voor items

    // Controleer of items bestaan en een array zijn
    if (Array.isArray(order.items) && order.items.length > 0) {
        // Voeg een sectie toe voor de items in de bestelling
        doc.setFontSize(14); // Grotere lettergrootte voor de sectietitel
        doc.setTextColor('#2f7193'); // Donkerblauw voor de sectietitel
        doc.text('Items:', orderInfoX, yPosition);

        // Tabelkoppen
        const headers = ['ID', 'Item Name', 'Quantity', 'Price'];
        const columnWidths = [18, 98, 43, 40];
        yPosition += 10;

        // Tabelkoppen
        headers.forEach((header, index) => {
            doc.setFontSize(12); // Standaard lettergrootte voor de kop
            doc.setTextColor('#2f7193'); // Gebruik de contrastkleur voor de koppen
            doc.text(header, orderInfoX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
        });

        // Lijn voor de kop
        doc.line(orderInfoX, yPosition + 5, 200, yPosition + 5); // Lijn onder de kop

        // Beginpositie voor de items
        yPosition += 15;

        // Itereer over de items en voeg ze toe aan de PDF
        const itemsPerPage = 25; // Maximum aantal items per pagina
        for (let i = 0; i < order.items.length; i++) {
            // Check of we een nieuwe pagina moeten beginnen
            if (i > 0 && i % itemsPerPage === 0) {
                doc.addPage(); // Nieuwe pagina toevoegen
                yPosition = 20; // Reset Y-positie voor de nieuwe pagina

                // Herhaal de koppen op de nieuwe pagina
                headers.forEach((header, index) => {
                    doc.setFontSize(12);
                    doc.setTextColor('#2f7193');
                    doc.text(header, orderInfoX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
                });
                // Lijn voor de kop
                doc.line(orderInfoX, yPosition + 5, 200, yPosition + 5); // Lijn onder de kop
                yPosition += 10; // Verhoog Y-positie voor de volgende regels
            }

            const item = order.items[i];
            doc.setTextColor('#EB6363'); // Kleur voor de items
            doc.text(`${i + 1}`, orderInfoX, yPosition); // Index
            doc.text(item.name || 'Unidentified', orderInfoX + 20, yPosition); // Item naam
            doc.text(item.quantity.toString(), orderInfoX + 120, yPosition); // Hoeveelheid
            doc.text(`€${item.price ? item.price.toFixed(2) : '0.00'}`, orderInfoX + 160, yPosition); // Prijs
            yPosition += 10; // Verhoog de Y-positie voor elk item
        }

        // Voeg een lijn toe onder de tabel
        yPosition += 5;
        doc.line(orderInfoX, yPosition - 5, 200, yPosition - 5); // Lijn onder de items
    } else {
        // Toon 'Unidentified' als er geen items zijn
        doc.setTextColor('#2f7193');
        const unidentifiedYPosition = yPosition - 20; // Maak deze positie hoger
        doc.text('Items: Unidentified', orderInfoX, unidentifiedYPosition);
    }

    // Subtotalen, kortingen en belasting toevoegen op een vaste positie
    const subtotalYPosition = yPosition + 5; // Verhoog de Y-positie voor subtotalen
    doc.setTextColor('#2f7193'); // Donkerblauw voor subtotalen
    doc.setFontSize(12);
    doc.text('Subtotal:', 140, subtotalYPosition); // X-positie
    doc.text(`€${order.total.toFixed(2)}`, 170, subtotalYPosition); // Voeg subtotalen toe

    // Download de PDF met ordernummer als bestandsnaam
    doc.save(`invoice_${order.orderNumber}.pdf`);
}

// Function to display orders in the HTML table
function displayOrders(orders) {
    const tableBody = document.querySelector('.orders-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Sort orders by date, most recent first
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    orders.forEach(order => {
        const row = document.createElement('tr');

        // Maak tabelcellen voor elk veld
        row.innerHTML = `
        <td data-label="Order Number">#${order.orderNumber}</td>
        <td data-label="Date">${formatDate(order.orderDate)}</td>
        <td data-label="Status" class="${order.status}">${order.status}</td>
        <td data-label="Total">€${order.total.toFixed(2)} for ${order.quantity} items</td>
        <td data-label="Invoice" class="view-button-container">
            <a href="#" class="pink_button shine download-btn" data-order-id="${order.orderNumber}">download</a>
        </td>
    `;

        tableBody.appendChild(row);
    });

    // Voeg de event listener toe voor de downloadknoppen
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const orderId = this.getAttribute('data-order-id');
            const selectedOrder = orders.find(order => order.orderNumber === orderId);
            generatePDF(selectedOrder); // Genereer de PDF voor de geselecteerde order
        });
    });

    countOrders(); // Count orders after displaying them
}

// Function to fetch the user's name and then fetch orders
function fetchUserName() {
    const apiUrl = "https://localhost:7190/me"; // API URL to fetch user info
    const token = sessionStorage.getItem("token"); // Get the token from session storage

    if (!token) {
        console.error("No token found in session storage.");
        return; // Stop the function if there's no token
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
        console.log("User data fetched:", data); // Log fetched user info

        // Fetch orders using the fetched userId
        fetchOrders(data.userId, token); // Pass userId and token
    })
    .catch(error => {
        const ordersBody = document.getElementById('orders-tbody');
        ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">An error occurred while fetching the userdata. Please try again later.</td></tr>';
        console.error("An error occurred while fetching user data:", error);
    });
}

// Function to fetch orders from the API
function fetchOrders(userId, token) { // Accept userId and token as parameters
    const apiUrl = `https://localhost:7040/orders/${userId}`; // Update with the correct API URL

    // Fetch orders data with the correct headers
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the Authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(orders => {
        console.log("Orders opgehaald:", orders); // Log de opgehaalde orders
        if (orders.length === 0) {
            // Als er geen orders zijn, toon een link naar de store
            const ordersBody = document.getElementById('orders-tbody');
            ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">You have no orders yet. <a href="../webshop/store.html" class="pink_button" style="margin-left: 20px;">go to our store</a></td></tr>';
        } else {
            displayOrders(orders); // Roep de functie aan om de orders weer te geven
        }
    })
    .catch(error => {
        const ordersBody = document.getElementById('orders-tbody');
        ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">An error occurred while fetching the orders. Please try again later.</td></tr>';
        console.error("An error occurred while fetching orders:", error);
    });
}

// Function to format date (you can adjust this format as needed)
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Call the fetchUserName function on page load
document.addEventListener("DOMContentLoaded", fetchUserName);
