document.addEventListener('DOMContentLoaded', function () {
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const collapseSidebarBtn = document.querySelector('.collapse-sidebar-btn');
    const expandSidebarBtn = document.querySelector('.expand-sidebar-btn');
    const storeSidebar = document.querySelector('.store-sidebar');
    const storeMainContent = document.querySelector('.store-main-content');
    const filterHeaders = document.querySelectorAll('.filter-header');
    const filterOptionCards = document.querySelectorAll('.filter-option-card');
    const selectedFiltersContainer = document.getElementById('selected-filters');
    const productGrid = document.getElementById('product-grid');
    const paginationElement = document.getElementById('pagination');

    const itemsPerPage = 3;
    const totalItems = 6;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const products = [
        { title: "Product 1", description: "Dit is een korte beschrijving van Product 1.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 2", description: "Dit is een korte beschrijving van Product 2.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 3", description: "Dit is een korte beschrijving van Product 3.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 4", description: "Dit is een korte beschrijving van Product 4.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 5", description: "Dit is een korte beschrijving van Product 5.", price: "€5", image: "https://via.placeholder.com/150" },
        { title: "Product 6", description: "Dit is een korte beschrijving van Product 6.", price: "€5", image: "https://via.placeholder.com/150" }
    ];

    let currentPage = 1;

    function updateSelectedFilters() {
        selectedFiltersContainer.innerHTML = ''; // Maak de container leeg
        const selectedOptions = Array.from(filterOptionCards).filter(option => option.classList.contains('selected'));
        
        selectedOptions.forEach(option => {
            const filterText = option.textContent; // Haal de tekst van de geselecteerde optie
            const filterElement = document.createElement('div');
            filterElement.className = 'selected-filter';
            filterElement.textContent = filterText;

            // Voeg een klik event toe om het filter te verwijderen
            filterElement.addEventListener('click', () => {
                option.classList.remove('selected'); // Verwijder de geselecteerde klasse
                updateSelectedFilters(); // Update de weergegeven filters
            });

            selectedFiltersContainer.appendChild(filterElement); // Voeg het filter toe aan de container
        });
    }

    // Handle filter toggle
    filterToggleBtn.addEventListener('click', function () {
        storeSidebar.classList.toggle('collapsed');
        storeMainContent.classList.toggle('shifted');
        expandSidebarBtn.style.display = storeSidebar.classList.contains('collapsed') ? 'block' : 'none';
        collapseSidebarBtn.style.display = storeSidebar.classList.contains('collapsed') ? 'none' : 'block';
    });

    // Handle filter header toggle
    filterHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const filterOptions = this.nextElementSibling;
            filterOptions.classList.toggle('show');
        });
    });

    // Handle selection of filter option
    filterOptionCards.forEach(option => {
        option.addEventListener('click', function () {
            const selectedCount = Array.from(filterOptionCards).filter(option => option.classList.contains('selected')).length;
            if (option.classList.contains('selected')) {
                option.classList.remove('selected'); // Verwijder geselecteerde status
            } else if (selectedCount < 5) { // Maximaal 5 filters selecteren
                option.classList.add('selected'); // Voeg geselecteerde status toe
            }
            updateSelectedFilters(); // Update de weergegeven filters
        });
    });

    // Handle collapse button click
    collapseSidebarBtn.addEventListener('click', function () {
        storeSidebar.classList.add('collapsed');
        storeMainContent.classList.add('shifted');
        collapseSidebarBtn.style.display = 'none';
        expandSidebarBtn.style.display = 'block';
    });

    // Handle expand button click
    expandSidebarBtn.addEventListener('click', function () {
        storeSidebar.classList.remove('collapsed');
        storeMainContent.classList.remove('shifted');
        expandSidebarBtn.style.display = 'none';
        collapseSidebarBtn.style.display = 'block';
    });

    function loadPage(page) {
        productGrid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageProducts = products.slice(start, end);

        pageProducts.forEach(product => {
            const productCard = `
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
            productGrid.innerHTML += productCard;
        });
    }

    function setupPagination() {
        paginationElement.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('pagination-button');
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                loadPage(currentPage);
                updatePagination();
            }
        };
        paginationElement.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button');
            pageButton.onclick = () => {
                loadPage(i);
                currentPage = i;
                updatePagination();
            };
            paginationElement.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('pagination-button');
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadPage(currentPage);
                updatePagination();
            }
        };
        paginationElement.appendChild(nextButton);
    }

    function updatePagination() {
        const buttons = paginationElement.querySelectorAll('.pagination-button');
        buttons.forEach((button, index) => {
            button.disabled = (index === 0 && currentPage === 1) || (index === buttons.length - 1 && currentPage === totalPages);
        });
    }

    function addToCart(productName) {
        console.log(`${productName} is toegevoegd aan de winkelwagentje!`);
    }

    loadPage(currentPage);
    setupPagination();
});
