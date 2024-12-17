// Load the search term from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('query');

// Fill the search input with the loaded search term
document.getElementById('search-results-input').value = searchTerm;

// Function to load the search index and perform the search
async function searchText() {
    const term = document.getElementById('search-results-input').value.trim(); // Get the trimmed search term from the input

    if (!term) { // If no search term is entered
        document.getElementById('results').innerHTML = '<p>Enter a search term.</p>'; // Display message to enter a term
        return;
    }

    try {
        // Load the search index from the JSON file
        const response = await fetch('../header & footer/search-index.json');
        const data = await response.json();

        // Configure Fuse.js for fuzzy search
        const options = {
            keys: ['title', 'content'], // Search through title and content
            includeMatches: true, // Include matched results in the output
            threshold: 0.4 // Set sensitivity for matching (lower = more sensitive)
        };

        const fuse = new Fuse(data, options);

        // Execute the search
        const results = fuse.search(term);

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results

        if (results.length > 0) { // If there are search results
            results.forEach(result => {
                const item = result.item; // Extract the item from the search result
                const snippet = getSnippet(item.content, term); // Get a snippet of the content with the highlighted term
                const resultElement = document.createElement('div');
                resultElement.classList.add('result-item'); // Add CSS class for styling

                resultElement.innerHTML = `
                    <h3><a href="${item.url}">${item.title}</a></h3> <!-- Display title and link -->
                    <p>${snippet}</p> <!-- Display snippet of content -->
                `;
                resultsDiv.appendChild(resultElement); // Append result to the results container
            });
        } else { // If no results found
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    } catch (error) {
        console.error('Error loading the search index:', error); // Log any errors
        document.getElementById('results').innerHTML = '<p>An error occurred while executing the search query.</p>';
    }
}

// Function to trigger search when the Enter key is pressed
function checkEnter(event) {
    if (event.key === 'Enter') {
        searchText(); // Trigger the search function
    }
}

// Function to create a snippet of content with the highlighted search term
function getSnippet(content, term) {
    const index = content.toLowerCase().indexOf(term.toLowerCase()); // Find the position of the search term in the content
    if (index === -1) return content; // If no match is found, return the full content

    const start = Math.max(index - 30, 0); // Get 30 characters before the match
    const end = Math.min(index + term.length + 30, content.length); // Get 30 characters after the match
    const snippet = content.substring(start, end); // Extract the snippet
    const regex = new RegExp(`(${term})`, 'gi'); // Create a regex to highlight the search term
    return '...' + snippet.replace(regex, '<strong>$1</strong>') + '...'; // Highlight the search term and return the snippet
}

// Execute the search immediately based on the loaded search term
searchText();
