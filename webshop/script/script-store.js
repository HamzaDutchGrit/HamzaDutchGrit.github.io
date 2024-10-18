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
                        price: "€5",
                        image: product.image // Haal de afbeelding uit het JSON-bestand
                    });
                });
            }

            products = productsArray;
            loadPage(currentPage);

            const options = {
                keys: ['title', 'code'],
                threshold: 0.3,
            };

            const fuse = new Fuse(products, options);

            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim().toLowerCase();
                performSearch(searchTerm, fuse);
            });

            searchInput.addEventListener('input', (event) => {
                const searchTerm = searchInput.value.trim().toLowerCase();

                if (searchTerm === '') {
                    searchResults = [];
                    loadPage(currentPage);
                    return;
                }
                performSearch(searchTerm, fuse);
            });

            searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const searchTerm = searchInput.value.trim().toLowerCase();
                    performSearch(searchTerm, fuse);
                }
            });
        })
        .catch(error => console.error('Error loading products:', error));

    // Functie om productkaarten te maken
    function createProductCard(product) {
        return `
<div class="store-product-card">
<a href="product.html?code=${product.code}" class="store-product-link">
<h3 class="store-product-title">${product.title}</h3>
<div class="store-product-image">
<img src="${product.image}" alt="Product Image"> <!-- Gebruik de afbeelding uit het JSON-bestand -->
</div>
<div class="store-product-details">
<div class="store-product-department">
<p>${product.department} | </p>
</div>
<div class="store-product-code">
<p>${product.code}</p> 
</div>
<div class="store-product-description" style="display: none;">
<p>${product.short_description}</p>
</div>
</div></a>
<div class="store-product-footer">
<p class="store-product-price">${product.price}</p>
<button class="pink_button_shop" onclick="addToCart('${product.title}', '${product.price}')">
<p class="cart" style="margin-left: 15px;">Add To Cart</p>
<span class="material-icons-outlined">add_shopping_cart</span>
</button>
</div>
</div>
`;
    }






    // Functie om geselecteerde filters op te slaan in localStorage
    function saveFiltersToLocalStorage() {
        localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
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

    // Functie om de weergegeven geselecteerde filters bij te werken
    function updateSelectedFilters() {
        selectedFiltersContainer.innerHTML = ''; // Normale filtercontainer voor grote schermen
        selectedFiltersContainer2.innerHTML = ''; // Extra normale container voor grote schermen
        const selectedFiltersSide = document.getElementById('selected-filters-2'); // Sidebar container
        selectedFiltersSide.innerHTML = ''; // Leeg sidebar container

        selectedFilters.forEach(filter => {
            const filterElement = document.createElement('div');
            filterElement.className = 'selected-filter';
            filterElement.textContent = filter;

            // Voeg event listener toe om filter te verwijderen bij klikken
            filterElement.addEventListener('click', () => {
                removeFilter(filter);
            });

            // Check of schermbreedte kleiner of groter is dan 630px
            if (window.innerWidth < 630) {
                // Voeg filter toe aan de sidebar container bij een kleiner scherm
                selectedFiltersSide.appendChild(filterElement);
            } else {
                // Voeg filter toe aan normale containers bij een groter scherm
                selectedFiltersContainer.appendChild(filterElement);
                selectedFiltersContainer2.appendChild(filterElement.cloneNode(true));
            }
        });

        // Toon/verberg containers afhankelijk van het aantal geselecteerde filters
        if (selectedFilters.length > 0) {
            if (window.innerWidth < 630) {
                // Zorg dat de sidebar zichtbaar is bij een kleiner scherm
                selectedFiltersSide.style.display = 'block';
                selectedFiltersContainer.classList.add('hidden');
                selectedFiltersContainer2.classList.add('hidden');
            } else {
                // Zorg dat normale containers zichtbaar zijn bij een groter scherm
                selectedFiltersContainer.classList.remove('hidden');
                selectedFiltersContainer2.classList.remove('hidden');
                selectedFiltersSide.style.display = 'none'; // Verberg sidebar bij groter scherm
            }
        } else {
            selectedFiltersContainer.classList.add('hidden');
            selectedFiltersContainer2.classList.add('hidden');
            selectedFiltersSide.style.display = 'none'; // Verberg sidebar als er geen filters zijn
        }
    }

    // Functie om een filter te verwijderen
    function removeFilter(filter) {
        selectedFilters = selectedFilters.filter(selected => selected !== filter);
        filterOptionCards.forEach(option => {
            if (option.textContent.trim() === filter) {
                window.location.reload();
                option.classList.remove('selected');


            }
        });
        updateSelectedFilters();
        saveFiltersToLocalStorage(); // Sla bijwerken van filters op in localStorage
        loadPage(currentPage);
    }

    // Functie om geselecteerde filters visueel te herstellen
    function restoreFilterSelection() {
        filterOptionCards.forEach(option => {
            const filterText = option.textContent.trim();
            if (selectedFilters.includes(filterText)) {
                option.classList.add('selected');
            }
        });
    }

    // Toggle filter optie selectie
    filterOptionCards.forEach(option => {
        option.addEventListener('click', function () {
            const filterText = option.textContent.trim();
            option.classList.toggle('selected');

            if (option.classList.contains('selected')) {
                selectedFilters.push(filterText);
            } else {
                removeFilter(filterText);
            }

            updateSelectedFilters();
            saveFiltersToLocalStorage(); // Sla bijwerken van filters op in localStorage
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

    // Event listener voor wanneer de zoekbalkinput verandert
    searchInput.addEventListener('input', (event) => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === '') {
            // Als de zoekbalk leeg is, reload de pagina
            window.location.reload();
            return;
        }

        performSearch(searchTerm, fuse); // Voer de zoekfunctie uit als er een zoekterm is
    });


    // Zoekfunctie met Fuse.js
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

        currentPage = 1;
        loadPage(currentPage);
        loadingIndicator.style.display = 'none';
    }


    function loadPage(page) {
        // Maak de grid leeg om nieuwe producten te laden
        productGrid.innerHTML = '';
        loadingIndicator.style.display = 'block';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Filteren van producten op basis van geselecteerde filters
        let filteredProducts = getFilteredProducts();

        // Laad producten: als er perfecte matches zijn, gebruik die; anders, gebruik de resultaten of originele producten
        const pageProducts = searchResults.length > 0 ? searchResults.slice(start, end) : filteredProducts.slice(start, end);

        // Bewaar de huidige scrollpositie
        const scrollPosition = window.scrollY;

        setTimeout(() => {
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
            loadingIndicator.style.display = 'none';

            // Herstel de scrollpositie na het laden van de nieuwe inhoud
            window.scrollTo(0, scrollPosition);
        }, 0);
    }



    // Initialiseer de pagina met de eerste producten
    loadPage(currentPage);
});

