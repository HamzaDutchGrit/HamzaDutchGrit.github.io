// Function to redirect the user to the search results page with the search term in the URL
function redirectToSearchPage() {
    const searchTerm = document.getElementById('search-input').value; // Get the search term from the input field
    if (searchTerm.trim() !== "") { // Check if the search term is not empty or just whitespace
        // Redirect to the search results page with the search term as a query parameter
        window.location.href = `../pages/search-results.html?query=${encodeURIComponent(searchTerm)}`;
    }
}
