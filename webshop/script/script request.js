document.addEventListener('DOMContentLoaded', function () {
    // Check if the required fields are filled
    const name = localStorage.getItem('name');
    const lastname = localStorage.getItem('lastname');
    const email = localStorage.getItem('email');
    const telephone = localStorage.getItem('telephone');
    const message = localStorage.getItem('message');

    if (!name || !lastname || !email || !telephone) {
        // Redirect to the contact information page if any fields are empty
        window.location.href = 'contact information order.html'; // Adjust the URL to the correct page
        return;
    }

    // Display customer information
    document.getElementById('display-name').textContent = name || 'N/A';
    document.getElementById('display-lastname').textContent = lastname || 'N/A';
    document.getElementById('display-email').textContent = email || 'N/A';
    document.getElementById('display-telephone').textContent = telephone || 'N/A';
    document.getElementById('display-message').textContent = message || 'N/A';

    // Display shopping cart items
    displayRequestPageItems();
});

// Function to display the products and values on the request page
function displayRequestPageItems() {
    const requestItemsContainer = document.querySelector('.request-items'); // Make sure this container exists in your HTML
    requestItemsContainer.innerHTML = '';

    // Retrieve the items from the cart
    let cartItems = localStorage.getItem('cart');
    try {
        cartItems = JSON.parse(cartItems) || [];
    } catch (error) {
        console.error('Error parsing cart items:', error);
        cartItems = [];
    }

    // Check if the cart is empty
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        requestItemsContainer.innerHTML = '<p>Your request list is empty.</p>';
        return;
    }

    // Display all items in the cart
    cartItems.forEach(item => {
        // Make sure all fields from localStorage are used
        const { title, short_description, price, image, quantity } = item;

        // Calculate the total price
        const totalPrice = parseFloat(price) * quantity;

        // Create a new item element
        const itemElement = document.createElement('div');
        itemElement.classList.add('request-item');

        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-image">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="item-description">
                    <h3>${title}</h3>
                    <p>${short_description || 'No description available.'}</p>
                </div>
            </div>
            <div class="item-quantity-price">
                <span style="" class="item-price">Price: €${totalPrice.toFixed(2)}</span>
                <span class="item-quantity">Quantity: ${quantity}</span>
            </div>
        `;

        requestItemsContainer.appendChild(itemElement);
    });

    // Display additional information from localStorage
    displayAdditionalValues();
}

// Function to display additional values from localStorage
function displayAdditionalValues() {
    const additionalValuesContainer = document.querySelector('.additional-values'); // Make sure this container exists in your HTML

    // Check if there are additional values saved
    const additionalValues = JSON.parse(localStorage.getItem('value')) || [];
    additionalValuesContainer.innerHTML = ''; // Clear the container first

    if (additionalValues.length === 0) {
        additionalValuesContainer.innerHTML = '<p>No additional values available.</p>';
        return;
    }

    // Loop through the additional values and display them
    additionalValues.forEach(value => {
        const valueElement = document.createElement('div');
        valueElement.classList.add('additional-value');
        valueElement.textContent = value; // Display the value as stored in localStorage
        additionalValuesContainer.appendChild(valueElement);
    });
}

// Load the request page items and additional values when the page loads
document.addEventListener('DOMContentLoaded', function () {
    displayRequestPageItems();
});