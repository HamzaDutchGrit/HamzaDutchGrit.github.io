// Function to fetch the username and then the orders
function fetchUserName() {
    const apiUrl = `${API_URL.accounts}me`; // API URL to fetch user information
    const token = sessionStorage.getItem("token"); // Get the token from session storage

    if (!token) {
        console.error("No token found in session storage."); // Log error if no token is found
        return; // Stop the function if there is no token
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

        // Place the name in the "Welcome" message and capitalize the first letter
        let userName = data.name || "User"; // If there is no name, use 'User' as a fallback
        userName = userName.charAt(0).toUpperCase() + userName.slice(1); // Capitalize the first letter

        // Update the welcome message with the formatted name
        document.getElementById("welcome-message").textContent = `Welcome ${userName}`;
        
        // Fetch orders using the userId
        fetchOrders(data.userId, token); // Use the correct property for userId
    })
    .catch(error => {
        const ordersBody = document.getElementById('orders-body');
        ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">An error occurred while fetching the userdata. Please try again later.</td></tr>';
        console.error("An error occurred while fetching the user data:", error); // Log error if fetching user data fails
    });
}

function fetchOrders(userId, token) {
    const apiUrl = `${API_URL.orders}orders/${userId}`; // API URL to fetch orders
    console.log(`Fetching orders from: ${apiUrl}`); // Log the API URL

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the Authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log("Response status:", response.status); // Log the response status
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(orders => {
        console.log("Orders fetched:", orders); // Log the fetched orders
        if (orders.length === 0) {
            // If there are no orders, show a link to the store
            const ordersBody = document.getElementById('orders-body');
            ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">You have no orders yet. <a href="../webshop/store.html" class="pink_button" style="margin-left: 20px;">go to our store</a></td></tr>';
        } else {
            displayOrders(orders); // Call the function to display the orders
        }
    })
    .catch(error => {
        const ordersBody = document.getElementById('orders-body');
        ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">An error occurred while fetching the orders. Please try again later.</td></tr>';
        console.error("An error occurred while fetching the orders:", error); // Log error if fetching orders fails
    });
}

// Function to generate PDF based on the selected order
function generatePDF(order) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title of the PDF
    doc.setFontSize(40); // Larger font size for the title
    doc.setTextColor('#60625f'); // Black for the title
    doc.text('Invoice', 10, 25); // Title position

    // Add logo with correct dimensions
    const logoUrl = '../media/depotsoftware pdf.webp'; // Ensure this path is correct
    const pageWidth = doc.internal.pageSize.getWidth(); // Page width
    const imgWidth = 80; // Set desired image width
    const imgHeight = 17; // Set desired image height
    const xPos = pageWidth - imgWidth - 10; // Ensure the image is on the right with a 10px margin
    doc.addImage(logoUrl, 'WEBP', xPos, 10, imgWidth, imgHeight);

    // Add order details
    doc.setFontSize(12); // Default font size for text
    doc.setTextColor('#60625f'); // Charcoal for order details
    const orderInfoX = 10; // X-position for order info
    doc.text(`Order Number: ${order.orderNumber}`, orderInfoX, 50);
    doc.text(`Order Date: ${formatDate(order.orderDate)}`, orderInfoX, 60);
    doc.text(`Order Status: ${order.status}`, orderInfoX, 70);
    doc.text(`Total: €${order.total.toFixed(2)} for ${order.quantity} items`, orderInfoX, 80);

    // Contact details on the right, placed higher
    const contactInfoX = (pageWidth / 2) + 15; // X-position for contact info
    const contactInfoYStart = 50; // Start Y-position for contact info (above order info)
    doc.setFontSize(12); // Default font size for contact info
    doc.setTextColor('#60625f'); // Black for contact details
    doc.text('Contact', contactInfoX, contactInfoYStart);
    doc.text('Email: info@depotsoftware.com', contactInfoX, contactInfoYStart + 10);
    doc.text('Phone: +31 88 999 8999', contactInfoX, contactInfoYStart + 20);
    doc.text('Address: De Zelling 8', contactInfoX, contactInfoYStart + 30);
    doc.text('3342GS Hendrik-Ido-Ambacht', contactInfoX, contactInfoYStart + 40);
    doc.text('The Netherlands', contactInfoX, contactInfoYStart + 50);

    // Starting position for the items
    let yPosition = 120; // Increased to 150 for items

    // Check if items exist and are in an array
    if (Array.isArray(order.items) && order.items.length > 0) {
        // Add a section for the items in the order
        doc.setFontSize(14); // Larger font size for section title
        doc.setTextColor('#2f7193'); // Dark blue for section title
        doc.text('Items:', orderInfoX, yPosition);

        // Table headers
        const headers = ['ID', 'Item Name', 'Quantity', 'Price'];
        const columnWidths = [18, 98, 43, 40];
        yPosition += 10;

        // Table headers
        headers.forEach((header, index) => {
            doc.setFontSize(12); // Default font size for headers
            doc.setTextColor('#2f7193'); // Use contrast color for headers
            doc.text(header, orderInfoX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
        });

        // Line under the header
        doc.line(orderInfoX, yPosition + 5, 200, yPosition + 5); // Line under the header

        // Starting position for the items
        yPosition += 15;

        // Iterate over the items and add them to the PDF
        const itemsPerPage = 25; // Maximum number of items per page
        for (let i = 0; i < order.items.length; i++) {
            // Check if we need to start a new page
            if (i > 0 && i % itemsPerPage === 0) {
                doc.addPage(); // Add new page
                yPosition = 20; // Reset Y-position for the new page

                // Repeat the headers on the new page
                headers.forEach((header, index) => {
                    doc.setFontSize(12);
                    doc.setTextColor('#2f7193');
                    doc.text(header, orderInfoX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
                });
                // Line under the header
                doc.line(orderInfoX, yPosition + 5, 200, yPosition + 5); // Line under the header
                yPosition += 10; // Increase Y-position for the next lines
            }

            const item = order.items[i];
            doc.setTextColor('#EB6363'); // Color for the items
            doc.text(`${i + 1}`, orderInfoX, yPosition); // Index
            doc.text(item.name || 'Unidentified', orderInfoX + 20, yPosition); // Item name
            doc.text(item.quantity.toString(), orderInfoX + 120, yPosition); // Quantity
            doc.text(`€${item.price ? item.price.toFixed(2) : '0.00'}`, orderInfoX + 160, yPosition); // Price
            yPosition += 10; // Increase Y-position for each item
        }

        // Add a line under the table
        yPosition += 5;
        doc.line(orderInfoX, yPosition - 5, 200, yPosition - 5); // Line under the items
    } else {
        // Show 'Unidentified' if no items exist
        doc.setTextColor('#2f7193');
        const unidentifiedYPosition = yPosition - 20; // Make this position higher
        doc.text('Items: Unidentified', orderInfoX, unidentifiedYPosition);
    }

    // Add subtotals, discounts, and tax at a fixed position
    const subtotalYPosition = yPosition + 5; // Increase Y-position for subtotals
    doc.setTextColor('#2f7193'); // Dark blue for subtotals
    doc.setFontSize(12);
    doc.text('Subtotal:', 140, subtotalYPosition); // X-position
    doc.text(`€${order.total.toFixed(2)}`, 170, subtotalYPosition); // Add subtotals

    // Download the PDF with the order number as the filename
    doc.save(`invoice_${order.orderNumber}.pdf`);
}

// Function to display orders in the HTML table with a download option
function displayOrders(orders) {
    const tableBody = document.querySelector('.orders-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Sort orders by date, most recent first
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    // Only take the latest 3 orders
    const latestOrders = orders.slice(0, 3);

    latestOrders.forEach(order => {
        const row = document.createElement('tr');

        // Create table cells for each field
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

    // Add the event listener for the download buttons
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const orderId = this.getAttribute('data-order-id');
            const selectedOrder = orders.find(order => order.orderNumber === orderId);
            generatePDF(selectedOrder); // Generate the PDF for the selected order
        });
    });
}

// Helper function to format the date (you can adjust this format as needed)
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Call the function to fetch the username as soon as the page is loaded
document.addEventListener("DOMContentLoaded", fetchUserName);
