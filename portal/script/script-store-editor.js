let disciplineGroups = {};  // Object to load the groups and their products
let selectedGroup = "";     // Currently selected group
let selectedProductIndex = null; // Selected product for editing

document.addEventListener("DOMContentLoaded", async function() {
    await loadDisciplineGroups();
    populateDropdown();
    // Set the flag in sessionStorage when the page is loaded
    sessionStorage.setItem('unsavedChanges', 'false');
});

// Function to track changes
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
    dropdown.innerHTML = ''; // Clear the dropdown

    // Add a default "Pick a Group" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pick a Group";
    defaultOption.disabled = true; // Make sure this cannot be selected
    defaultOption.selected = true; // Make sure it's selected by default
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
    productList.innerHTML = ''; // Reset the list

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

    productContainer.style.display = "block"; // Show the product container
    product_button.style.display = "block";  // Show the product buttons
}

function toggleProductDetail(productDiv, index) {
    // Check if the product is already expanded
    const isExpanded = productDiv.classList.contains("expanded");

    // If the product is already expanded, close it
    if (isExpanded) {
        productDiv.classList.remove("expanded");
    } else {
        // Add the 'expanded' class to unfold the product
        productDiv.classList.add("expanded");
        // Edit the product (open the edit modal)
        editProduct(index);
    }
}

// Opens the product modal to edit a product by index.
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
    markUnsavedChanges(); // Track unsaved changes
}

// Saves the product after creating or editing it.
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
        disciplineGroups[selectedGroup].push(newProduct); // Add new product
    } else {
        disciplineGroups[selectedGroup][selectedProductIndex] = newProduct; // Update existing product
    }

    closeProductModal(); // Close the modal after saving
    showGroupProducts(selectedGroup); // Reload the product list
}

// Opens the modal to add a new product and shows a loader.
function openProductModal() {
    document.getElementById("product-modal-title").textContent = "Add Item";
    document.getElementById("product-modal").style.display = "block";
    selectedProductIndex = null; // No product is selected for editing
    sessionStorage.setItem('unsavedChanges', 'true'); // Flag for unsaved changes
    showLoader(true); // Show the loader while the form loads

    // Hide loader after a short simulated delay
    setTimeout(() => {
        showLoader(false); 
    }, 500);
}

// Shows or hides a loading spinner.
function showLoader(show) {
    const loader = document.getElementById("loader");
    loader.style.display = show ? "block" : "none";
}

// Closes the product modal and resets the form.
function closeProductModal() {
    document.getElementById("product-modal").style.display = "none";
    
    // Remove the 'expanded' class from any currently expanded product
    const expandedProduct = document.querySelector(".product-item.expanded");
    if (expandedProduct) {
        expandedProduct.classList.remove("expanded");
    }

    // Reset all form fields
    document.getElementById("product-code").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-short-description").value = "";
    document.getElementById("product-long-description").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-quantity").value = "";
}

// Warns the user about unsaved changes when trying to leave the page.
window.addEventListener('beforeunload', function (event) {
    if (sessionStorage.getItem('unsavedChanges') === 'true') {
        event.preventDefault();
        event.returnValue = ''; // Shows confirmation message on page unload
    }
});

// Opens the group modal and sets the dropdown value to "add-new" for creating a new group.
function openGroupModal() {
    document.getElementById("group-modal").style.display = "block"; // Show the modal
    document.getElementById("discipline-dropdown").value = "add-new"; // Set the dropdown to "add-new"
}

// Creates a new group based on the user input in the modal.
function createNewGroup() {
    const newGroupName = document.getElementById("new-discipline-name").value.trim();
    if (!newGroupName) return alert("Please enter a group name."); // Check for empty input
    
    if (!disciplineGroups[newGroupName]) { // Check if the group already exists
        disciplineGroups[newGroupName] = []; // Add the new group
        populateDropdown(); // Update the dropdown with the new group
        sessionStorage.setItem('unsavedChanges', 'true'); // Flag unsaved changes
    }
    closeGroupModal(); // Close the modal after creating the group
}

// Closes the group modal and resets the dropdown selection.
function closeGroupModal() {
    document.getElementById("group-modal").style.display = "none"; // Hide the modal
    document.getElementById("discipline-dropdown").value = ""; // Reset dropdown selection
}

// Saves the current data (disciplineGroups) as a JSON file.
function saveJsonToFile() {
    const token = sessionStorage.getItem("token"); // Retrieve the token from session storage

    if (!token) {
        console.error("Geen token gevonden in session storage."); // Log error if no token
        return; // Exit the function if there's no token
    }

    const jsonData = JSON.stringify(disciplineGroups, null, 2); // Convert the data to JSON format

    const blob = new Blob([jsonData], { type: 'application/json' }); // Create a Blob with the JSON data

    const link = document.createElement("a"); // Create a temporary link for the download
    link.href = URL.createObjectURL(blob);
    link.download = "products.json"; // Set the default file name for the download

    document.body.appendChild(link); // Add the link to the DOM, trigger download, and remove it
    link.click();
    document.body.removeChild(link);

    sessionStorage.setItem('unsavedChanges', 'false'); // Reset the unsaved changes flag
}
