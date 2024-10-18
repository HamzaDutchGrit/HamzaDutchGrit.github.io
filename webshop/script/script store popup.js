function addToCart(productTitle, productCode, productPrice, productImage, short_description, isRecommended = false, fromPopup = false) {
    console.log("Adding to cart:", { title: productTitle, code: productCode, price: productPrice, description : short_description, isRecommended, fromPopup });

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Controleer of het product al in de cart zit
    let existingProduct = cart.find(item => item.code === productCode);

    // Standaard quantity voor aanbevolen producten is 1
    let quantity = 1;

    // Voor het hoofdproduct (niet aanbevolen) proberen we de waarde van het input-veld te pakken, als dat bestaat
    if (!isRecommended) {
        const quantityInput = document.getElementById('popup-quantity');
        if (quantityInput) {
            quantity = parseInt(quantityInput.value);
        }
    }

    // Update de hoeveelheid als het product al in de cart zit, anders voeg een nieuw item toe
    if (existingProduct) {
        existingProduct.quantity += quantity; // Voeg de hoeveelheid toe aan het bestaande product
    } else {
        // Voeg het nieuwe product toe aan de winkelwagen
        let product = {
            title: productTitle,
            code: productCode,
            price: productPrice,
            description : short_description,
            quantity: quantity // Zet de quantity
        };
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update de cart count
    updateCartCount();

    // Toon de popup alleen als het niet vanuit een bestaande popup wordt toegevoegd
    if (!fromPopup) {
        loadPopup(productTitle, productPrice, productImage, productCode, short_description);
    } else {
        console.log('Geen popup omdat het product via een bestaande popup is toegevoegd.');
    }

    // Update button styles
    const button = document.getElementById(`add-to-cart-${productCode}`);
    if (button) {
        button.style.fontSize = '12px'; // Verklein de tekstgrootte
        button.style.backgroundColor = '#2f7193'; // Change to dark blue
        button.style.color = 'white'; // White text for contrast
        button.disabled = true; // Disable the button
        button.innerHTML = 'Added to Cart'; // Change button text
    }
}


function updateQuantityInCart(productName, productPrice, productImage, short_description, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Zoek het bestaande product in de cart
    let existingProduct = cart.find(item => item.title === productName);

    if (existingProduct) {
        // Werk de hoeveelheid bij
        existingProduct.quantity = newQuantity;
        console.log(`Quantity updated to: ${newQuantity}`);
    } else {
        // Als het product nog niet in de cart staat, voeg het toe met de nieuwe hoeveelheid
        let product = {
            title: productName,
            code: productName, // of gebruik een unieke code
            price: productPrice,
            description: short_description,
            quantity: newQuantity
        };
        cart.push(product);
        console.log('New product added to cart with updated quantity');
    }

    // Update de cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optioneel: update de cart-teller in de UI
    updateCartCount();
}





async function loadPopup(productName, productPrice, productImage, productCode, short_description) {
    console.log("Loading popup for:", productCode); // Debugging

    // Verkrijg de aanbevolen producten
    const recommendedProducts = await fetchRecommendedProducts(productCode);
    
    // Laad het externe popup bestand
    try {
        const response = await fetch('shopping cart popup.html');
        if (!response.ok) {
            throw new Error('Netwerk respons was niet ok');
        }
        const data = await response.text();
        document.getElementById('popup-container').innerHTML = data;

        // Nu de popup geladen is, kunnen we de inhoud aanpassen
        showPopup(productName, productPrice, productImage, short_description, recommendedProducts);
    } catch (error) {
        console.error("Error loading popup:", error);
    }
}

async function showPopup(productName, productPrice, productImage, short_description, recommendedProducts) {
    console.log("Showing popup for product:", productName); // Debugging

    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    // Update product information in the popup
    document.querySelector('.popup-product img').src = productImage || 'https://via.placeholder.com/150';
    document.querySelector('.popup-product .product-info h3').textContent = productName;
    document.querySelector('.popup-product .product-info p').textContent = productPrice;

    // Voeg de quantity input toe onder de productinformatie
    document.querySelector('.popup-product .product-info').innerHTML += `
        <div class="quantity-container">
            <label for="popup-quantity">Quantity:</label>
            <input type="number" id="popup-quantity" value="1" min="1" style="width: 50px; margin-left: 5px;">
        </div>
    `;

    // Voeg een event listener toe aan het quantity input-veld om live de hoeveelheid bij te werken
    const quantityInput = document.getElementById('popup-quantity');
    quantityInput.addEventListener('input', () => {
        updateQuantityInCart(productName, productPrice, productImage, short_description, parseInt(quantityInput.value));
    });

    // Voeg aanbevolen producten toe aan de popup
    const recommendedProductsContainer = document.querySelector('.popup-recommendations');
    recommendedProductsContainer.innerHTML = ''; // Clear the container

    // Add header
    const headerElement = document.createElement('div');
    headerElement.classList.add('popup-header');
    headerElement.innerHTML = '<p>You may also like.</p>';
    recommendedProductsContainer.appendChild(headerElement);

    recommendedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('popup-recommendation');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.product}" class="recommendation-image">
            <div class="recommendation-info">
                <h3>${truncateTitle(product.product)}</h3>
                <p>${product.price}</p>
            </div>
            <div class="recommendation-footer">
                <p style="display: none;">${product.short_description}</p>
                <button class="pink_button" id="add-to-cart-${product.code}" onclick="addToCart('${product.product}', '${product.code}', '${product.price}', '${product.image}', '${product.short_description}', true, true)">
                    <span class="material-icons">add_shopping_cart</span>
                </button>
            </div>`;
        recommendedProductsContainer.appendChild(productElement);
    });

    // Toon de popup en overlay
    popup.style.display = 'block';
    overlay.style.display = 'block';
}




async function fetchRecommendedProducts(productCode) {
    // Verkrijg de eerste drie letters van de productcode
    const departmentCode = productCode.slice(0, 3);

    try {
        const response = await fetch('products.json');
        const data = await response.json();

        // Log de data voor debugging
        console.log("Fetched data:", data);

        let allProducts = [];
        for (const group in data.discipline_group) {
            allProducts = allProducts.concat(data.discipline_group[group]);
        }

        // Filter de producten op basis van de eerste drie letters van de productcode
        const recommendedProducts = allProducts.filter(product =>
            product.code.startsWith(departmentCode) && product.code !== productCode
        ).slice(0, 3); // Neem de eerste 3 producten

        // Log de aanbevolen producten voor debugging
        console.log("Recommended products:", recommendedProducts);

        // Zorg ervoor dat de prijs en afbeelding worden toegevoegd aan elk product
        return recommendedProducts.map(product => ({
            code: product.code,
            product: product.product,
            price: product.price || "€5", // Standaardprijs als niet beschikbaar
            image: product.image || "https://via.placeholder.com/150" // Standaardafbeelding
        }));
    } catch (error) {
        console.error("Error loading products.json:", error);
        return [];
    }
}




function updateCartCount() {
    // Haal de winkelwageninhoud op uit localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Haal het aantal producten op
    let itemCount = cart.length;

    // Update de teller in de HTML
    document.getElementById('cart-count').textContent = itemCount;
}
// Functie om het aantal uit localStorage te halen en bij te werken
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Haal cart op uit localStorage
    return cart.length; // Geef het aantal items in de cart terug
}



function hidePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    popup.classList.add('hide');
    overlay.classList.add('hide');

    setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }, 300);
}



function truncateTitle(title, maxLength = 25) {
    if (title.length > maxLength) {
        return title.slice(0, maxLength) + '...'; // Voeg '...' toe om aan te geven dat het is afgekort
    }
    return title;
}

