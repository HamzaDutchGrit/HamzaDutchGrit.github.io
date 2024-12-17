// Functie om winkelmand in localStorage op te slaan
function saveCartToLocalStorage(cartItems) {
    // Sla de bijgewerkte cart-items op in localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();  // Update de winkelwagenteller wanneer de inhoud is opgeslagen
    fetchProducts(); // Aanroepen om aanbevelingen te tonen wanneer een nieuw product wordt toegevoegd
}

function addToCart(productTitle, productCode, productPrice, productImage, short_description, quantity = 1, fromPopup = false) {
    console.log("addToCart called with:", { productTitle, productCode, productPrice, short_description, quantity });

    if (!productTitle || !productCode || !productPrice || !productImage) {
        console.error("Missing product details");
        return; // Stop de functie als er informatie ontbreekt
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(item => item.code === productCode);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            title: productTitle,
            code: productCode,
            price: parseFloat(productPrice), // Zorg ervoor dat het een float is
            image: productImage,
            description: short_description,
            quantity: quantity
        });
    }

    console.log("Updated Cart:", cart); // Debug-log
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        document.querySelector('.empty-cart-message').style.display = 'block';
        cartItemsContainer.style.display = 'none';
        document.querySelector(".total-price").textContent = `€0.00`;
        updateCartCount();
        return;
    }

    document.querySelector('.empty-cart-message').style.display = 'none';
    cartItemsContainer.style.display = 'block';

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.setAttribute('data-id', index + 1);

        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-image">
                    <a href="product.html?code=${item.code}">
                        <img src="${item.image}" alt="${item.title}">
                    </a>
                </div>
                <div class="item-description">
                    <a href="product.html?code=${item.code}">
                        <h3>${item.title}</h3>
                    </a>
                    <p>${item.short_description || 'No description available'}</p> <!-- Use a fallback if undefined -->
                </div>
            </div>
            <div class="item-quantity-price">
                <span class="item-price">€${item.price}</span>
                <div class="quantity-control">
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                </div>
                <button class="delete-item" aria-label="Remove Product ${index + 1}">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        `;

        const quantityInput = itemElement.querySelector('.quantity-input');
        quantityInput.addEventListener('change', function () {
            const newQuantity = parseInt(this.value, 10);
            if (newQuantity > 0) {
                updateQuantity(item.title, newQuantity);
            } else {
                this.value = item.quantity;
            }
        });

        const deleteButton = itemElement.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            removeItem(item.title);
        });

        cartItemsContainer.appendChild(itemElement);
    });

    updateSubtotal(cartItems);
    updateCartCount();
    fetchProducts();
}

document.addEventListener('DOMContentLoaded', () => {
    // Toast-functie
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');

        const toast = document.createElement('div');
        toast.className = 'toast';

        // Voeg het icoon en de tekst toe
        toast.innerHTML = `
            <span class="material-symbols-outlined">check_circle</span>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Event listener voor het verwijderen van een item
    document.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-item');

        if (deleteButton) {
            console.log('Delete button clicked');

            // Haal de titel van het product op
            const productTitle = deleteButton
                .closest('.cart-item') // Zorg ervoor dat de parent container correct wordt opgehaald
                .querySelector('.item-description h3') // Pas deze selector aan op basis van jouw HTML
                .textContent;

            // Laat de toast zien met de producttitel
            showToast(`${productTitle} is removed from your shopping cart`);
        }
    });
});

// Laad winkelwagenitems bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
});

// Functie om de subtotal en productlijst bij te werken
function updateSubtotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalContainer = document.querySelector('.subtotal-container');
    const productListContainer = document.querySelector('.product-list');

    if (!subtotalContainer || !productListContainer) return;

    if (cartItems.length === 0) {
        subtotalContainer.style.display = 'none';
    } else {
        subtotalContainer.style.display = 'block';
    }

    productListContainer.innerHTML = '';

    let subtotal = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.price.toString().replace(/[^\d.-]/g, ''));
        if (!isNaN(price)) {
            subtotal += price * item.quantity;
        }

        const itemElement = document.createElement('div');
        itemElement.classList.add('product-info');
        itemElement.innerHTML = `
            <span class="product-name">${item.title} (${item.quantity})</span>
            <span class="product-price">€${(price * item.quantity).toFixed(2)}</span>
        `;
        productListContainer.appendChild(itemElement);
    });

    const totalPriceContainer = document.querySelector('.total-price');
    if (totalPriceContainer) {
        totalPriceContainer.textContent = `€${subtotal.toFixed(2)}`;
    }
}


// Functie om de hoeveelheid van een item bij te werken
function updateQuantity(title, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems.find(item => item.title === title);

    if (item) {
        item.quantity = newQuantity;
        saveCartToLocalStorage(cartItems); // Sla de gewijzigde winkelwagen op in localStorage
        displayCartItems();  // Vernieuw de winkelwagenweergave
    }
}

// Sluitknop van de pop-up koppelen
document.getElementById('popup-close').addEventListener('click', function () {
    document.getElementById('popup-message').classList.add('hidden');
});

// Verwijdert het item en toont de titel in de toast
function removeItem(productTitle) {
    // Haal de huidige winkelwagenitems op uit localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Filter het item uit de winkelwagen
    cartItems = cartItems.filter(item => item.title !== productTitle);

    // Sla de bijgewerkte winkelwagen op
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Update de UI
    displayCartItems();
    updateSubtotal();
}

// Event listener voor het verwijderen van producten
document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-item');
    if (deleteButton) {
        // Vind de bijbehorende producttitel
        const productTitle = deleteButton
            .closest('.cart-item')
            .querySelector('.item-description h3')
            .textContent;

        // Verwijder het product
        removeItem(productTitle);
    }
});

// Event listener voor het verwijderen van producten
document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-item');
    if (deleteButton) {
        // Vind de bijbehorende producttitel
        const productTitle = deleteButton
            .closest('.cart-item')
            .querySelector('.item-description h3')
            .textContent;

        // Verwijder het product
        removeItem(productTitle);
    }
});

// Functie om de winkelwagenteller bij te werken en het icoon zichtbaar/verberg te maken
function updateCartCount() {
    // Haal de winkelwageninhoud op uit localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tel de hoeveelheden van alle producten op (totaal aantal items)
    let itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Update de teller in de HTML
    document.getElementById('cart-count').textContent = itemCount;

    // Toon of verberg het winkelwagentje-icoon op basis van de inhoud van de winkelwagen
    const cartIcon = document.querySelector('.cart-icon');
    if (cart.length === 0) {
        // Toon het icoon als de winkelmand leeg is
        cartIcon.style.display = 'block';
    } else {
        // Verberg het icoon als er items in de winkelmand zijn
        cartIcon.style.display = 'none';
    }
}

let cachedRecommendations = []; // Variabele om de aanbevolen producten op te slaan

// Functie om producten uit JSON te fetchen
function fetchProducts() {
    // Kijk of de aanbevolen producten al in de localStorage staan
    const storedRecommendations = localStorage.getItem('recommendations');

    if (storedRecommendations) {
        // Als de aanbevolen producten al opgeslagen zijn, gebruik deze
        displayRecommendations(JSON.parse(storedRecommendations));
    } else {
        // Als er geen opgeslagen producten zijn, haal ze op en sla ze op in localStorage
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                const allProducts = collectAllProducts(data); // Verzamel alle producten
                const randomProducts = getRandomRecommendations(allProducts, 4); // Kies willekeurige producten

                // Sla de aanbevolen producten op in de localStorage
                localStorage.setItem('recommendations', JSON.stringify(randomProducts));

                displayRecommendations(randomProducts); // Weergeven van aanbevolen producten
            })
            .catch(error => console.error('Error fetching products:', error));
    }
}

// Functie om producten uit alle disciplinegroepen te verzamelen
function collectAllProducts(data) {
    const allProducts = [];
    for (const group in data.discipline_group) {
        if (Array.isArray(data.discipline_group[group])) {
            allProducts.push(...data.discipline_group[group]);
        }
    }
    return allProducts;
}

// Functie om willekeurige aanbevelingen te selecteren
function getRandomRecommendations(products, count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Functie om aanbevelingen weer te geven
function displayRecommendations(recommendations) {
    const recommendationsContainer = document.querySelector('.recommendations');
    recommendationsContainer.innerHTML = ''; // Oude aanbevelingen verwijderen

    recommendations.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('recommendation-item');

        // Maak een link die naar de productpagina leidt, gebaseerd op de product code
        const productLink = document.createElement('a');
        productLink.href = `product.html?code=${product.code}`; // Verwijst naar productpagina met de product code in de URL

        item.innerHTML = `
            <img src="${product.image}" alt="${product.product}" class="recommendation-image">
            <h3 class="recommendation-title">${product.product}</h3>
            <span class="recommendation-price">€${product.price}</span>
        `;

        // Voeg de link toe rond de item-content
        productLink.appendChild(item);

        recommendationsContainer.appendChild(productLink);
    });
}

// Verkrijg de product ID uit de URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Haal de productinformatie op basis van de ID
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        const product = data.find(p => p.id === productId);  // Zoek het product op basis van de ID

        if (product) {
            // Toon de productinformatie op de pagina
            document.querySelector('.product-title').textContent = product.product;
            document.querySelector('.product-description').textContent = product.description;
            document.querySelector('.product-price').textContent = `€${product.price}`;
            document.querySelector('.product-image').src = product.image;
        } else {
            // Product niet gevonden
            document.querySelector('.product-info').textContent = 'Product niet gevonden';
        }
    })
    .catch(error => console.error('Error fetching product data:', error));

// Wacht totdat de DOM volledig is geladen voordat je de producten fetcht
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Aanroepen om producten te fetchen bij het laden van de pagina
    displayCartItems(); // Zorg dat het winkelwagentje wordt weergegeven
    updateSubtotal(); // Zorg dat de subtotal wordt bijgewerkt bij het laden

    const continueBtn = document.querySelector('.continue-shopping-btn');
    if (continueBtn) {
        continueBtn.classList.add('styled');
    }
});


document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
    updateSubtotal(); // Zorg dat de subtotal wordt bijgewerkt bij het laden
});

if (event.target.closest('.delete-item')) {
    console.log('Delete button clicked');
}