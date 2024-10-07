document.addEventListener('DOMContentLoaded', function () {
    // Elementen selecteren
    const filterHeaders = document.querySelectorAll('.filter-header'); // Filterheaders
    const filterOptionCards = document.querySelectorAll('.filter-option-card');
    const selectedFiltersContainer = document.getElementById('selected-filters');
    const selectedFiltersContainer2 = document.getElementById('selected-filters-2'); // Nieuwe container
    const productGrid = document.getElementById('product-grid');
    const paginationElement = document.getElementById('pagination');
    const sidebar = document.querySelector('.sidebar');

    // Zoekbalk elementen
    const searchInput = document.getElementById('search-input'); 
    const searchButton = document.getElementById('search-button');

    // Loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Loading...';
    loadingIndicator.style.display = 'none';
    document.body.appendChild(loadingIndicator); // Append to body or a specific container

    // Pagina en product data setup
    const itemsPerPage = 6;
    const products = [
        { title: "Product 1", description: "Description of Product 1.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 2", description: "Description of Product 2.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 3", description: "Description of Product 3.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 4", description: "Description of Product 4.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 5", description: "Description of Product 5.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 6", description: "Description of Product 6.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 7", description: "Description of Product 7.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 8", description: "Description of Product 8.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 9", description: "Description of Product 9.", price: "€5", image: "https://via.placeholder.com/150" }
    ];

    let currentPage = 1;

    // Functie om productkaarten te maken
    function createProductCard(product) {
        return `
            <div class="store-product-card">
                <h3 class="store-product-title">${product.title}</h3>
                <div class="store-product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <p class="store-product-description">${product.description}</p>
                <p class="store-product-price">${product.price}</p>
                <button class="pink_button_shop" onclick="addToCart('${product.title}')">
                    <span class="material-icons-outlined">add_shopping_cart</span>
                </button>
            </div>
        `;
    }

    // Functie om de weergegeven geselecteerde filters bij te werken
    function updateSelectedFilters() {
        const selectedOptions = Array.from(filterOptionCards).filter(option => option.classList.contains('selected'));

        // Leeg beide containers
        selectedFiltersContainer.innerHTML = '';
        selectedFiltersContainer2.innerHTML = '';

        selectedOptions.forEach(option => {
            const filterText = option.textContent.trim();
            const filterElement = document.createElement('div');
            filterElement.className = 'selected-filter';
            filterElement.textContent = filterText;

            filterElement.addEventListener('click', () => {
                option.classList.remove('selected');
                updateSelectedFilters(); // Herlaad de filters
                loadPage(currentPage); // Herlaad de producten
            });

            const isMobile = window.innerWidth <= 630; // Controleer de schermbreedte
            if (isMobile) {
                selectedFiltersContainer2.appendChild(filterElement); // Plaats in de tweede container voor mobiel
            } else {
                selectedFiltersContainer.appendChild(filterElement); // Plaats in de eerste container voor desktop
            }
        });

        // Controleer of de schermbreedte is veranderd en verplaats de filters
        if (window.innerWidth > 630) {
            // Verplaats de filters van de tweede container naar de eerste als het scherm breder is dan 630px
            Array.from(selectedFiltersContainer2.children).forEach(filter => {
                selectedFiltersContainer.appendChild(filter);
            });
            selectedFiltersContainer2.style.display = 'none'; // Verberg de tweede container
        } else {
            selectedFiltersContainer2.style.display = selectedOptions.length > 0 ? 'block' : 'none'; // Toon de tweede container indien nodig
        }

        // Toon of verberg de selected-filters-card op basis van geselecteerde filters
        const selectedFiltersCard = document.getElementById('selected-filters-card');
        selectedFiltersCard.style.display = selectedOptions.length > 0 ? 'block' : 'none'; // Maak zichtbaar of verberg
    }

    // Toggle filter optie selectie met beperking
    filterOptionCards.forEach(option => {
        option.addEventListener('click', function () {
            option.classList.toggle('selected');
            updateSelectedFilters();
            loadPage(currentPage);
        });
    });

    // Toggle filter header zichtbaarheid
    filterHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const filterOptions = this.nextElementSibling;
            filterOptions.classList.toggle('show');
        });
    });

    // Laad de producten voor de geselecteerde pagina
    function loadPage(page) {
        productGrid.innerHTML = '';
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Filter producten op basis van geselecteerde filters
        const filteredProducts = getFilteredProducts();
        const pageProducts = filteredProducts.slice(start, end);

        // Simulate loading time
        setTimeout(() => {
            pageProducts.forEach(product => {
                productGrid.innerHTML += createProductCard(product);
            });

            setupPagination(filteredProducts.length);
            loadingIndicator.style.display = 'none'; // Hide loading indicator
        }, 500); // Simulated delay of 500ms
    }

    // Functie om producten te filteren op basis van de geselecteerde filters
    function getFilteredProducts() {
        const selectedOptions = Array.from(filterOptionCards).filter(option => option.classList.contains('selected')).map(option => option.textContent.trim());
        return products.filter(product => {
            return selectedOptions.length === 0 || selectedOptions.includes(product.title);
        });
    }
    
    // Setup paginering controls
    function setupPagination(filteredItemCount) {
        paginationElement.innerHTML = '';
        const totalPages = Math.ceil(filteredItemCount / itemsPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Vorige';
        prevButton.classList.add('pagination-button');
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                loadPage(currentPage);
            }
        };
        paginationElement.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button');
            pageButton.onclick = () => {
                currentPage = i;
                loadPage(currentPage);
            };
            paginationElement.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Volgende';
        nextButton.classList.add('pagination-button');
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadPage(currentPage);
            }
        };
        paginationElement.appendChild(nextButton);
    }

    // Functie om producten te filteren op basis van de zoekterm met debouncing
    let debounceTimer;
    function filterProducts() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.title.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );

            productGrid.innerHTML = '';
            filteredProducts.forEach(product => {
                productGrid.innerHTML += createProductCard(product);
            });

            setupPagination(filteredProducts.length);
        }, 300); // Debounce tijd
    }

    // EventListener voor de zoekbalk
    searchInput.addEventListener('input', filterProducts);
    searchButton.addEventListener('click', filterProducts);

    // Sidebar toggelen
    sidebar.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // Initialiseer de pagina met producten
    loadPage(currentPage);

    // Event listener voor venstergrootte verandering
    window.addEventListener('resize', updateSelectedFilters); // Bijwerken van geselecteerde filters bij resize
});
