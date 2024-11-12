document.addEventListener('DOMContentLoaded', function () {
    // Elementen selecteren
    const filterHeaders = document.querySelectorAll('.filter-header'); 
    const filterOptionCards = document.querySelectorAll('.filter-option-card');
    const selectedFiltersContainer = document.getElementById('selected-filters');
    const selectedFiltersContainer2 = document.getElementById('selected-filters-2'); 
    const productGrid = document.querySelector('.store-product-grid');
    const paginationElement = document.querySelector('.pagination');
    
    

    // Zoekbalk elementen
    const searchInput = document.querySelector('.store-search-input'); 
    const searchButton = document.querySelector('.search-icon');

    // Loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Loading...';
    loadingIndicator.style.display = 'none';
    document.body.appendChild(loadingIndicator);

    const itemsPerPage = 6;
    let products = []; 
    let currentPage = 1;
    let searchResults = []; // Zoekresultaten opslaan
    let totalPages = 1; // Totale aantal pagina's opslaan
    let selectedFilters = []; // Voor het bijhouden van geselecteerde filters

    
    // Close Sidebar Button functionality
    document.querySelector('.close-sidebar-button').addEventListener('click', function () {
        document.querySelector('.store-sidebar').style.display = 'none';
    });

    // Hamburger menu functionality to open sidebar
    document.querySelector('.hamburger-menu').addEventListener('click', function () {
        document.querySelector('.store-sidebar').style.display = 'block';
    });

// Laad het JSON-bestand
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        const productsArray = [];

        for (const [group, productsList] of Object.entries(data.discipline_group)) {
            productsList.forEach(product => {
                productsArray.push({
                    title: product.product,
                    department: group.split(" - ")[0], 
                    type: group.split(" - ")[1], 
                    code: product.code,
                    price: '€' + product.price,  // Hier gebruik je een vaste prijs, dit kun je aanpassen als nodig.
                    image: product.image,
                    short_description: product.short_description || 'Geen beschrijving beschikbaar' // Voeg short_description toe
                });
            });
        }

        products = productsArray; 
        loadPage(currentPage); 

        const options = {
            keys: ['title', 'code'], 
            threshold: 0.5, 
        };

        const fuse = new Fuse(products, options);

        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            performSearch(searchTerm, fuse);
        });

        searchInput.addEventListener('input', (event) => {
            const searchTerm = searchInput.value.trim().toLowerCase(); // Verkrijg de waarde van de zoekbalk
            const suggestionText = document.getElementById('suggestion-text');
            const notFoundContainer = document.getElementById('not-found-container');
        
            if (searchTerm === '') {
                searchResults = []; // Reset de zoekresultaten
                suggestionText.style.display = 'none'; // Verberg suggestietekst
                notFoundContainer.style.display = 'none'; // Verberg 'not found' tekst
                loadPage(currentPage); // Laad de oorspronkelijke producten
                return; // Stop verdere uitvoering
            }
            
            performSearch(searchTerm, fuse); // Voer de zoekfunctie uit
        });
        

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const searchTerm = searchInput.value.trim().toLowerCase();
                performSearch(searchTerm, fuse);
            }
        });
    })
    .catch(error => console.error('Error loading products:', error));



    function createProductCard(product) {
        return `
        <div class="store-product-card">
            <a href="product.html?code=${product.code}" class="store-product-link">
                <h3 class="store-product-title">${product.title.length > 15 ? product.title.substring(0, 15) + '...' : product.title}</h3>
                <div class="store-product-image">
                    <img src="${product.image}" alt="Product Image">
                </div>
                <div class="store-product-details">
                    <div class="store-product-department">
                        <p>${product.department} | </p>
                    </div>
                    <div class="store-product-code">
                        <p>${product.code}</p> 
                    </div>
                    <div class="store-product-description" style="display: none;">
                        <p>${product.short_description || 'Geen beschrijving beschikbaar'}</p> <!-- Zorg dat de beschrijving altijd aanwezig is -->
                    </div>
                </div>
            </a>
            <div class="store-product-footer">
                <p class="store-product-price">${product.price}</p>
                <button class="pink_button_shop" style="background-color: var(--dark_blue);" onclick="addToCart('${product.title}', '${product.code}', '${product.price}', '${product.image}', '${product.short_description }'); cartIcon(event)">
                    <p class="cart" style="margin-left: 15px;">Add To Cart</p>
                    <span class="material-icons-outlined">add_shopping_cart</span>
                </button>
            </div>
        </div>
        `;
    }
    


    



    // Functie om geselecteerde filters uit localStorage te laden
    function loadFiltersFromLocalStorage() {
        const storedFilters = localStorage.getItem('selectedFilters');
        if (storedFilters) {
            selectedFilters = JSON.parse(storedFilters);
            updateSelectedFilters(); // Werk de weergegeven filters bij
            restoreFilterSelection(); // Herstel de geselecteerde filters visueel
        }
    }


        // Functie om filter toe te voegen of te verwijderen en beide containers bij te werken
        function toggleFilter(filterText) {
            const filterIndex = selectedFilters.indexOf(filterText);
    
            if (filterIndex > -1) {
                // Verwijder filter als het al is geselecteerd
                selectedFilters.splice(filterIndex, 1);
            } else {
                // Voeg filter toe als het nog niet is geselecteerd
                selectedFilters.push(filterText);
            }
            
            updateSelectedFilters();
        }

         // Synchroniseer filtercontainer met de sidebar-opties
    function syncSidebarWithSelectedFilters() {
        filterOptionCards.forEach(option => {
            const filterText = option.textContent.trim();
            if (selectedFilters.includes(filterText)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    // Update the function that removes a filter and reloads the page with updated filters
    function removeFilter(filter) {
        // Remove the filter from the selectedFilters array
        selectedFilters = selectedFilters.filter(selected => selected !== filter);

        // Update the UI with the selected filters
        updateSelectedFilters();
        
        // Reload the page with the updated filters and the current page
    }



    // Functie om geselecteerde filters visueel te herstellen
    function restoreFilterSelection() {
        filterOptionCards.forEach(option => {
            const filterText = option.textContent.trim();
            if (selectedFilters.includes(filterText)) {
                currentPage = 1;
                option.classList.add('selected');
            }
        });
    }

// Pas de `updateSelectedFilters`-functie aan
function updateSelectedFilters() {
    selectedFiltersContainer.innerHTML = ''; // Maak de container leeg

    selectedFilters.forEach(filter => {
        const filterElement = document.createElement('div');
        filterElement.className = 'selected-filter';
        filterElement.textContent = filter;

        // Voeg een close-icon toe om de filter te verwijderen
        const closeIcon = document.createElement('span');
        closeIcon.className = 'material-icons-outlined';
        closeIcon.textContent = 'close';

        closeIcon.addEventListener('click', () => {
            toggleFilter(filter);  // Synchroniseer direct bij verwijdering
            syncSidebarWithSelectedFilters(); // Update sidebar
            loadPage(currentPage); // Laad de pagina opnieuw zonder het verwijderde filter
        });

        filterElement.appendChild(closeIcon);
        selectedFiltersContainer.appendChild(filterElement);
    });

    syncSidebarWithSelectedFilters();
}

// Event listeners voor klikken op sidebar-filters
filterOptionCards.forEach(option => {
    option.addEventListener('click', function () {
        const filterText = option.textContent.trim();
        toggleFilter(filterText); // Voeg toe of verwijder uit `selectedFilters`
        loadPage(currentPage); // Laad de pagina opnieuw bij elke wijziging
    });
});

// Aanroepen bij paginalaad
loadPage(currentPage);
syncSidebarWithSelectedFilters(); // Zorg dat sidebar en container gelijk zijn bij het laden
    // Toggle filter header zichtbaarheid
    filterHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const filterOptions = this.nextElementSibling;
            filterOptions.classList.toggle('show');
        });
    });

    // Voeg een event listener toe om te detecteren wanneer de schermbreedte verandert
    window.addEventListener('resize', () => {
        updateSelectedFilters(); // Zorg dat filters goed worden bijgewerkt bij het aanpassen van de schermgrootte
    });

    // Laad de opgeslagen filters bij het laden van de pagina
    window.addEventListener('load', () => {
        loadFiltersFromLocalStorage(); // Herstel filters vanuit localStorage
    });


    function setupPagination(filteredItemCount) {
        paginationElement.innerHTML = '';  
        totalPages = Math.ceil(filteredItemCount / itemsPerPage);  
    
        const screenWidth = window.innerWidth;
        const maxVisiblePages = screenWidth < 630 ? 3 : 3;
    
        let startPage, endPage;
    
        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 2) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1; 
                endPage = currentPage + 1; 
            }
        }
    
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<span class="material-symbols-outlined" id="arrow-back">arrow_back_ios</span>'; 
        prevButton.classList.add('pagination-button');
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--; 
                loadPage(currentPage); // Laad de pagina na het klikken
            }
        };
        paginationElement.appendChild(prevButton);
    
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button');
    
            if (i === currentPage) {
                pageButton.classList.add('active-page');
            }
    
            pageButton.onclick = () => {
                currentPage = i;
                loadPage(currentPage); // Laad de pagina na het klikken
            };
    
            paginationElement.appendChild(pageButton);
        }
    
        if (endPage < totalPages) {
            const ellipsisButton = document.createElement('button');
            ellipsisButton.textContent = '…';
            ellipsisButton.classList.add('pagination-button', 'ellipsis');
            ellipsisButton.disabled = true; 
            paginationElement.appendChild(ellipsisButton);
            
            const lastPageButton = document.createElement('button');
            lastPageButton.textContent = totalPages; 
            lastPageButton.classList.add('pagination-button');
            lastPageButton.onclick = () => {
                currentPage = totalPages;
                loadPage(currentPage); // Laad de pagina na het klikken
            };
            paginationElement.appendChild(lastPageButton);
        }
    
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<span class="material-symbols-outlined" id="arrow-forward">arrow_forward_ios</span>'; 
        nextButton.classList.add('pagination-button');
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++; 
                loadPage(currentPage); // Laad de pagina na het klikken
            }
        };
        paginationElement.appendChild(nextButton);
    }
    // Functie om producten te filteren op basis van de geselecteerde filters
    function getFilteredProducts() {
        const selectedDepartments = new Set();
        const selectedTypes = new Set();

        // Verkrijg geselecteerde filters
        filterOptionCards.forEach(option => {
            if (option.classList.contains('selected')) {
                const filterText = option.textContent.trim();
                if (filterText.includes('Foundation')) {
                    selectedDepartments.add('Foundation');
                }
                if (filterText.includes('Basic')) {
                    selectedTypes.add('Basic');
                }
                if (filterText.includes('Add. options')) {
                    selectedTypes.add('Add. options');
                }

                if (filterText.includes('Depot Services')) {
                    selectedDepartments.add('Depot Services');
                }
                if (filterText.includes('Optimized')) {
                    selectedTypes.add('Optimized');
                }

                if (filterText.includes('Loaded Services')) {
                    selectedDepartments.add('Loaded Services');
                }
                if (filterText.includes('Basic')) {
                    selectedTypes.add('Basic');
                }
                if (filterText.includes('Optimized')) {
                    selectedTypes.add('Optimized');
                }
                if (filterText.includes('Cleaning Services')) {
                    selectedDepartments.add('Cleaning Services');
                }
                if (filterText.includes('Basic')) {
                    selectedTypes.add('Basic');
                }
                if (filterText.includes('Optimized')) {
                    selectedTypes.add('Optimized');
                }

                if (filterText.includes('M&R Services')) {
                    selectedDepartments.add('M&R Services');
                }
                if (filterText.includes('Basic')) {
                    selectedTypes.add('Basic');
                }
                if (filterText.includes('Add. options')) {
                    selectedTypes.add('Add. options');
                }
            }
        });

        // Filter producten op basis van geselecteerde filters
        return products.filter(product => {
            const matchesDepartment = selectedDepartments.size === 0 || selectedDepartments.has(product.department);
            const matchesType = selectedTypes.size === 0 || selectedTypes.has(product.type);
            return matchesDepartment && matchesType; // Beide filters moeten overeenkomen
        });
    }

    


function performSearch(searchTerm, fuse) {
    loadingIndicator.style.display = 'block'; 
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    const results = fuse.search(trimmedSearchTerm); 
    searchResults = results.map(result => result.item);

    const suggestionText = document.getElementById('suggestion-text');
    const notFoundContainer = document.getElementById('not-found-container');

    // Verberg standaard de suggestionText en notFoundContainer
    suggestionText.style.display = 'none';
    notFoundContainer.style.display = 'none';

    

    // Check of er een perfecte match is op basis van product.code of title
    const perfectMatchByCode = searchResults.find(product => product.code.toLowerCase() === trimmedSearchTerm);
    const perfectMatchByTitle = searchResults.find(product => product.title.trim().toLowerCase() === trimmedSearchTerm);

    if (perfectMatchByCode) {
        // Als er een perfecte match is op product.code
        searchResults = [perfectMatchByCode]; 
        suggestionText.style.display = 'none'; 
        notFoundContainer.style.display = 'none'; // Verberg 'not found' tekst
    } else if (perfectMatchByTitle) {
        // Als er een perfecte match is op product.title
        searchResults = [perfectMatchByTitle];
        suggestionText.style.display = 'none'; 
        notFoundContainer.style.display = 'none';
    } else if (searchResults.length > 0) {
        // Geen perfecte match, maar wel suggesties
        suggestionText.innerHTML = "Do you mean:";
        suggestionText.style.display = 'block'; // Toon suggestietekst met suggesties
        notFoundContainer.style.display = 'none'; // Verberg 'not found' tekst
    } else {
        // Helemaal geen resultaten of suggesties
        productGrid.style.display = 'none'; // Verberg product grid als er geen resultaten zijn
        suggestionText.style.display = 'none'; // Verberg suggestietekst
        notFoundContainer.style.display = 'block'; // Toon 'not found' tekst
        paginationElement.style.display = 'none'; // Verberg paginatie
    }

    loadingIndicator.style.display = 'none';  
}


function loadPage(page) {
    productGrid.innerHTML = ''; // Dit zorgt ervoor dat je begint met een schone lijst
    loadingIndicator.style.display = 'block'; // Toon de laadanimering

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Filteren van producten op basis van geselecteerde filters
    let filteredProducts = getFilteredProducts(); 

    // Laad producten: als er perfecte matches zijn, gebruik die; anders, gebruik de resultaten of originele producten
    const pageProducts = searchResults.length > 0 ? searchResults.slice(start, end) : filteredProducts.slice(start, end);
    
    // Bewaar de huidige scrollpositie
    const scrollPosition = window.scrollY;

    // Zorg ervoor dat je de producten niet dubbel toevoegt
    productGrid.innerHTML = ''; // Nogmaals, leeg de product grid voordat je nieuwe producten laadt

    setTimeout(() => {
        // Voeg de producten van de huidige pagina toe aan het grid
        pageProducts.forEach(product => {
            productGrid.innerHTML += createProductCard(product);
        });
        
        // Voeg lege placeholders toe als er minder dan 6 producten zijn (voor 2 rijen van 3)
        const emptySlots = itemsPerPage - pageProducts.length;
        for (let i = 0; i < emptySlots; i++) {
            productGrid.innerHTML += `
                <div class="empty-product-card">
                    <div style="background-color: white; height: 250px;"></div> <!-- Placeholder -->
                </div>
            `;
        }

        // Zorg ervoor dat de paginatie werkt, zelfs bij zoekresultaten
        setupPagination(searchResults.length > 0 ? searchResults.length : filteredProducts.length);
        loadingIndicator.style.display = 'none'; // Verberg de laadanimering
        
        // Herstel de scrollpositie na het laden van de nieuwe inhoud
        window.scrollTo(0, scrollPosition);
    }, 0);
}

    // Initialiseer de pagina met de eerste producten
    loadPage(currentPage);
});

























function addToCart(productTitle, productCode, productPrice, productImage, short_description = 'Geen beschrijving beschikbaar.', isRecommended = false, fromPopup = false) {
    console.log("Adding to cart:", { title: productTitle, code: productCode, price: productPrice, description: short_description, isRecommended, fromPopup });

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Controleer of het product al in de cart zit op basis van de unieke productcode
    let existingProduct = cart.find(item => item.code === productCode);

    if (existingProduct) {
        // Als het product al in de winkelwagen zit, verhoog alleen de hoeveelheid van dat product
        existingProduct.quantity = existingProduct.quantity + 1;
        console.log(`Product ${productTitle} is already in the cart. Quantity increased to: ${existingProduct.quantity}.`);
    } else {
        // Voeg het nieuwe product toe aan de cart met de standaard hoeveelheid van 1
        let product = {
            title: productTitle,
            code: productCode, // Unieke productcode
            price: productPrice,
            image: productImage, // Voeg de afbeelding toe aan het product object
            description: short_description,
            quantity: 1 // Start altijd met 1 voor een nieuw product
        };
        cart.push(product);
        console.log(`New product ${productTitle} added to cart with quantity: 1.`);
    }

    // Sla de bijgewerkte cart op in localStorage
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
        button.style.backgroundColor = '#2f7193'; // Verander naar donkerblauw
        button.style.color = 'white'; // Witte tekst voor contrast
        button.style.fontSize = '14px'; // Verwijder de rand
        button.disabled = true; // Zet de knop op disabled
        button.innerHTML = 'Added to Cart'; // Verander de knoptekst
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
            price: '€' + productPrice,
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
    
        // Nu de popup geladen is, kunnen we de inhoud aanpassen
        showPopup(productName, productPrice, productImage, short_description, recommendedProducts);

}

async function showPopup(productName, productPrice, productImage, short_description, recommendedProducts) {
    console.log("Showing popup for product:", productName); // Debugging

    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    // Update product information in the popup
    document.querySelector('.popup-product img').src = productImage || 'https://via.placeholder.com/150';
    document.querySelector('.popup-product .product-info h3').textContent = productName;
    document.querySelector('.popup-product .product-info p').textContent = productPrice;

    // Clear any existing quantity input
    const existingQuantityContainer = document.querySelector('.quantity-container');
    if (existingQuantityContainer) {
        existingQuantityContainer.remove(); // Remove the previous quantity input if it exists
    }

    // Voeg de nieuwe quantity input toe onder de productinformatie
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container');
    quantityContainer.innerHTML = `
        <label for="popup-quantity">Quantity:</label>
        <input type="number" id="popup-quantity" value="1" min="1" style="width: 50px; margin-left: 5px;">
    `;
    document.querySelector('.popup-product .product-info').appendChild(quantityContainer);

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
                <p>€${product.price}</p>
            </div>
            <div class="recommendation-footer">
                <p style="display: none;">${product.short_description || 'Geen beschrijving beschikbaar.'}</p>
                <button class="pink_button" id="add-to-cart-${product.code}" onclick="addToCart('${product.product}', '${product.code}', '${product.price}', '${product.image}', '${product.short_description || 'Geen beschrijving beschikbaar.'}', true, true)">
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
    const departmentCode = productCode.slice(0, 3);

    try {
        const response = await fetch('products.json');
        const data = await response.json();
        let allProducts = [];
        
        for (const group in data.discipline_group) {
            allProducts = allProducts.concat(data.discipline_group[group]);
        }

        const recommendedProducts = allProducts.filter(product =>
            product.code.startsWith(departmentCode) && product.code !== productCode
        ).slice(0, 3); 

        return recommendedProducts.map(product => ({
            code: product.code,
            product: product.product,
            price: product.price,
            image: product.image || "https://via.placeholder.com/150",
            short_description: product.short_description || 'Geen beschrijving beschikbaar.' // Voeg default waarde toe
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



function hideStorePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    popup.style.display = 'none';
        overlay.style.display = 'none';

}



function truncateTitle(title, maxLength = 15) {
    if (title.length > maxLength) {
        return title.slice(0, maxLength) + '...'; // Voeg '...' toe om aan te geven dat het is afgekort
    }
    return title;
}

