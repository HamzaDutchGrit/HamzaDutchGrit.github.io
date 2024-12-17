// Function to get and update the total product count (based on quantity) from localStorage
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage

    // Sum up the quantities of all items in the cart
    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    return totalQuantity; // Return the total number of items
}

// Update the cart icon with the item count
function updateCartCountDisplay() {
    const cartCount = document.getElementById('cart-count');
    const count = getCartCount(); // Get the total product count in the cart

    if (count > 99) {
        cartCount.textContent = '99+'; // Display 99+ if the count is greater than 99
    } else {
        cartCount.textContent = count; // Display the actual count
    }

    // Show or hide the circle based on the count value
    if (count > 0) {
        cartCount.style.display = 'flex'; // Show the circle if count is greater than 0
    } else {
        cartCount.style.display = 'none'; // Hide the circle if count is 0
    }
}

// Function triggered when the cart icon is clicked
function cartIcon(event) {
    event.preventDefault(); // Prevent page navigation

    // Update the display of the cart icon
    updateCartCountDisplay();
}

// Call this function to display the cart count when the page loads
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);
