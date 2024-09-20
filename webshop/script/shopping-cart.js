// Select necessary elements
const cartItemsContainer = document.querySelector(".cart-items");
const productList = document.querySelector(".product-list");
const totalPriceElement = document.querySelector(".total-price");

// Function to recalculate the total price
function recalculateTotal() {
    let total = 0;
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(cartItem => {
        const priceText = cartItem.querySelector(".item-price").textContent.replace('€', '');
        const quantity = cartItem.querySelector("input[type='number']").value;
        total += parseFloat(priceText) * parseInt(quantity);
    });

    // Update the total price display
    totalPriceElement.textContent = `€${total.toFixed()}`;
}

// Function to remove both the cart item and its corresponding product from the subtotal
function removeItem(button) {
    const cartItem = button.closest(".cart-item"); // Find the cart item

    // Remove the cart item
    cartItem.remove();

    // Recalculate the subtotal and total price after the item is removed
    updateSubtotal();
    
    // Check if the cart is empty
    if (cartItemsContainer.children.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceElement.textContent = '€0.00';
    }
}

// Event listener for deleting items
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-item');

    // Attach event listeners to delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            removeItem(this); // Call the remove function when the delete button is clicked
        });
    });
}

// Event listener for quantity changes
function setupQuantityInputs() {
    const quantityInputs = document.querySelectorAll("input[type='number']");

    // Attach event listeners to quantity inputs
    quantityInputs.forEach(input => {
        input.addEventListener("input", function () {
            recalculateTotal(); // Recalculate total when quantity changes
        });
    });
}

// Function to update subtotal and product list display
function updateSubtotal() {
    let total = 0;

    // Clear and update product list display
    productList.innerHTML = ''; // Clear existing product list

    const remainingItems = document.querySelectorAll(".cart-item");
    remainingItems.forEach(item => {
        const productName = item.querySelector(".item-description h3").textContent;
        const itemPrice = parseFloat(item.querySelector(".item-quantity-price span").textContent.replace('€', '')); // Get the base price
        const quantity = parseInt(item.querySelector(".quantity-control input").value); // Get the quantity

        // Calculate the total price for the current item
        const currentItemTotalPrice = itemPrice * quantity;

        // Create a new product entry with quantity and updated price
        const productInfoDiv = document.createElement("div");
        productInfoDiv.classList.add("product-info");
        productInfoDiv.setAttribute('data-id', item.getAttribute('data-id')); // Set the same ID to the subtotal product
        productInfoDiv.innerHTML = `
            <span class="product-name">${productName} (${quantity})</span>
            <span class="product-price">€${currentItemTotalPrice.toFixed(2)}</span>
        `;
        productList.appendChild(productInfoDiv); // Add new product to the list

        // Accumulate total price
        total += currentItemTotalPrice; // Update total with the current item total
    });

    // Update total price display
    totalPriceElement.textContent = `€${total.toFixed(2)}`;

    // If no items left, show a message
    if (remainingItems.length === 0) {
        productList.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.textContent = '€0.00';
    }
}


// Initial subtotal update on page load
document.addEventListener("DOMContentLoaded", function () {
    updateSubtotal();
    setupDeleteButtons(); // Attach event listeners to delete buttons on page load
    setupQuantityInputs(); // Attach event listeners to quantity inputs on page load
});

// Function to setup delete buttons and input listeners
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-item');

    // Attach event listeners to delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            removeItem(this); // Call the remove function when the delete button is clicked
        });
    });

    // Add listeners to quantity input fields
    const quantityInputs = document.querySelectorAll('.quantity-control input');
    quantityInputs.forEach(input => {
        input.addEventListener("input", function () {
            updateSubtotal(); // Call the updateSubtotal function when the input changes
        });
    });
}

// Initial subtotal update on page load
document.addEventListener("DOMContentLoaded", function () {
    updateSubtotal();
    setupDeleteButtons(); // Attach event listeners to delete buttons and quantity inputs on page load
});