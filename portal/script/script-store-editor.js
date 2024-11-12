let disciplineGroups = {};  // Object om de groepen en hun producten te laden
let selectedGroup = "";     // Huidige geselecteerde groep
let selectedProductIndex = null; // Geselecteerd product om te bewerken

document.addEventListener("DOMContentLoaded", async function() {
    await loadDisciplineGroups();
    populateDropdown();
    // Zet het flag in sessionStorage wanneer de pagina geladen wordt
    sessionStorage.setItem('unsavedChanges', 'false');
});

// Functie om de wijzigingen bij te houden
function markUnsavedChanges() {
    sessionStorage.setItem('unsavedChanges', 'true');
}
async function loadDisciplineGroups() {
    try {
        const response = await fetch('../webshop/products.json');
        const data = await response.json();
        disciplineGroups = data.discipline_group || {};
    } catch (error) {
        console.error("Error loading discipline groups:", error);
    }
}

function populateDropdown() {
    const dropdown = document.getElementById("discipline-dropdown");
    dropdown.innerHTML = ''; // Maak de dropdown leeg

    // Voeg een standaard "Pick a Group" optie toe
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pick a Group";
    defaultOption.disabled = true; // Zorg ervoor dat deze niet geselecteerd kan worden
    defaultOption.selected = true; // Zorg ervoor dat deze standaard geselecteerd is
    dropdown.appendChild(defaultOption);

    for (const group in disciplineGroups) {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        dropdown.appendChild(option);
    }

    const addNewOption = document.createElement("option");
    addNewOption.value = "add-new";
    addNewOption.textContent = "+ Add New Group";
    dropdown.appendChild(addNewOption);
}

function handleDisciplineSelection() {
    const dropdown = document.getElementById("discipline-dropdown");
    selectedGroup = dropdown.value;

    if (selectedGroup === "add-new") {
        openGroupModal();
    } else if (selectedGroup) {
        showGroupProducts(selectedGroup);
    }
}

function showGroupProducts(groupName) {
    const productContainer = document.getElementById("product-container");
    const product_button = document.getElementById("product-container-buttons");
    const productList = document.getElementById("product-list");
    document.getElementById("selected-group-title").textContent = `Group: ${groupName}`;
    productList.innerHTML = ''; // Reset de lijst

    const products = disciplineGroups[groupName] || [];
    products.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-item");

        productDiv.innerHTML = `
        <div class="product-item">
            <img src="${product.image}" alt="${product.product}" class="product-image">
            <div class="product-info">
                <strong class="product-code">${product.code}</strong>
                <span class="product-name">${product.product}</span>
                <p class="product-description">${product.long_description}</p>
            </div>
            <div class="product-price-container">
                <span class="product-price">€${product.price}</span>
            </div>
        </div>
    `;


        productDiv.onclick = () => toggleProductDetail(productDiv, index);
        productList.appendChild(productDiv);
    });

    productContainer.style.display = "block"; // Toon de productcontainer
    product_button.style.display = "block";
}

function toggleProductDetail(productDiv, index) {
    // Controleer of het product al is uitgebreid
    const isExpanded = productDiv.classList.contains("expanded");

    // Als het product al is uitgebreid, sluit het dan
    if (isExpanded) {
        productDiv.classList.remove("expanded");
    } else {
        // Voeg de 'expanded' class toe om het product uit te vouwen
        productDiv.classList.add("expanded");
        // Bewerk het product (open de bewerkingsmodal)
        editProduct(index);
    }
}

function editProduct(index) {
    const product = disciplineGroups[selectedGroup][index];
    document.getElementById("product-modal-title").textContent = "Edit Item";
    document.getElementById("product-code").value = product.code;
    document.getElementById("product-name").value = product.product;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-short-description").value = product.short_description;
    document.getElementById("product-long-description").value = product.long_description;
    document.getElementById("product-image").value = product.image;
    document.getElementById("product-quantity").value = product.quantity;
    selectedProductIndex = index;
    document.getElementById("product-modal").style.display = "block";

    // Markeer dat er onopgeslagen wijzigingen zijn
    markUnsavedChanges();
}

function saveProduct() {
    const code = document.getElementById("product-code").value.trim();
    const name = document.getElementById("product-name").value.trim();
    const price = parseFloat(document.getElementById("product-price").value);
    const shortDescription = document.getElementById("product-short-description").value.trim();
    const longDescription = document.getElementById("product-long-description").value.trim();
    const image = document.getElementById("product-image").value.trim();
    const quantity = parseInt(document.getElementById("product-quantity").value);

    if (!code || !name || isNaN(price) || isNaN(quantity)) return alert("Please fill in all fields.");

    const newProduct = { code, product: name, price, short_description: shortDescription, long_description: longDescription, image, quantity };

    if (selectedProductIndex === null) {
        disciplineGroups[selectedGroup].push(newProduct); // Voeg nieuw product toe
    } else {
        disciplineGroups[selectedGroup][selectedProductIndex] = newProduct; // Bewerk bestaand product
    }

    closeProductModal();
    showGroupProducts(selectedGroup); // Herlaad de productenlijst
}

function openProductModal() {
    document.getElementById("product-modal-title").textContent = "Add Item";
    document.getElementById("product-modal").style.display = "block";
    selectedProductIndex = null;
    sessionStorage.setItem('unsavedChanges', 'true');

    // Toon de loader wanneer het formulier wordt geladen
    showLoader(true);

    // Wacht een korte tijd voordat de loader verdwijnt (voorbeeld van simuleren van een laadproces)
    setTimeout(() => {
        showLoader(false);
    }, 500); // Verberg loader na 0.5 seconden
}

function showLoader(show) {
    const loader = document.getElementById("loader");
    if (show) {
        loader.style.display = "block";
    } else {
        loader.style.display = "none";
    }
}

function closeProductModal() {
    document.getElementById("product-modal").style.display = "none";
    
    // Zoek naar het product-item dat de class 'expanded' heeft
    const expandedProduct = document.querySelector(".product-item.expanded");
    
    // Als zo'n product-item bestaat, verwijder dan de class 'expanded'
    if (expandedProduct) {
        expandedProduct.classList.remove("expanded");
    }

    // Reset het formulier om ervoor te zorgen dat de velden leeg zijn bij het sluiten van de modal
    document.getElementById("product-code").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-short-description").value = "";
    document.getElementById("product-long-description").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-quantity").value = "";
}

window.addEventListener('beforeunload', function (event) {
    if (sessionStorage.getItem('unsavedChanges') === 'true') {
        event.preventDefault();
        event.returnValue = ''; // Dit toont een bevestigingsbericht
    }
});


function openGroupModal() {
    // Zet de display van de group-modal naar 'block' om het zichtbaar te maken
    document.getElementById("group-modal").style.display = "block";
    
    // Zet de geselecteerde waarde van de dropdown naar "add-new" als je op "Add New Group" hebt geklikt
    document.getElementById("discipline-dropdown").value = "add-new";
}


function createNewGroup() {
    const newGroupName = document.getElementById("new-discipline-name").value.trim();
    if (!newGroupName) return alert("Please enter a group name.");
    
    if (!disciplineGroups[newGroupName]) {
        disciplineGroups[newGroupName] = [];
        populateDropdown();  // Update dropdown
        sessionStorage.setItem('unsavedChanges', 'true');
    }
    closeGroupModal();
}

function closeGroupModal() {
    // Zet de display van de group-modal naar 'none' om het te verbergen
    document.getElementById("group-modal").style.display = "none";
    
    // Reset de geselecteerde waarde van de dropdown naar een standaardwaarde (bijv. de eerste optie)
    document.getElementById("discipline-dropdown").value = ""; // Of zet dit naar de eerste groep als dat gewenst is
}

// Functie om de JSON data op te slaan als een bestand
function saveJsonToFile() {
    const token = sessionStorage.getItem("token"); // Haal het token op uit de session storage

    if (!token) {
        console.error("Geen token gevonden in session storage.");
        return; // Stop de functie als er geen token is
    }

    // Zet de actuele data om naar JSON formaat
    const jsonData = JSON.stringify(disciplineGroups, null, 2);

    // Maak een blob van de JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Maak een tijdelijke link voor het downloaden van de JSON file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.json"; // Bestandsnaam voor het gedownloade bestand

    // Voeg de link toe aan de DOM, trigger de download en verwijder de link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    sessionStorage.setItem('unsavedChanges', 'false');
}
