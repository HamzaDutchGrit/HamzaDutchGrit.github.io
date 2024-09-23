function updateCart() {
    // Select all elements with the class 'cart-item'
    const cartItems = document.querySelectorAll('.cart-item'); 
    // Get the cart section by its ID
    const cart = document.getElementById('cart');
    // Get the empty cart section by its ID
    const emptyCart = document.getElementById('empty-cart');

    // Check if there are any items in the cart
    if (cartItems.length === 0) {
        // If no items, hide the cart and show the empty cart message
        cart.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        // If there are items, show the cart and hide the empty cart message
        cart.style.display = 'block';
        emptyCart.style.display = 'none';
    }
}

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

function checkCart() {
    const cartItems = getCartItems(); // Vervang dit door jouw eigen logica om de winkelmand items op te halen
    if (cartItems.length === 0) {
        // Redirect naar de lege winkelwagentje-pagina
        window.location.href = "shopping cart empty.html"; // Zorg ervoor dat de bestandsnaam klopt
    }
}

// Roep de functie aan wanneer de pagina laadt
document.addEventListener("DOMContentLoaded", checkCart);

document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.querySelector('.cart-items');
    const cartSection = document.querySelector('.shopping-cart');
    const emptyCartSection = document.getElementById('empty-cart');

    // Function to check if cart is empty and toggle sections
    function checkCartStatus() {
        const items = cartItems.querySelectorAll('.cart-item');
        if (items.length === 0) {
            // If there are no items, show the empty cart section
            cartSection.style.display = 'none';
            emptyCartSection.classList.remove('hidden');
            emptyCartSection.classList.add('visible');
        } else {
            // If there are items, show the cart section
            cartSection.style.display = 'block';
            emptyCartSection.classList.add('hidden');
            emptyCartSection.classList.remove('visible');
        }
    }

    // Initial check for cart status on page load
    checkCartStatus();

    // Assuming you have a delete item button, update the cart after an item is deleted
    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            cartItem.remove();
            checkCartStatus();
        });
    });
});

// Call the updateCart function to execute the logic
updateCart();
