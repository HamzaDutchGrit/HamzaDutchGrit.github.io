// Selecteer alle taaloptieknoppen op de pagina
const languageButtons = document.querySelectorAll('.language-options button');

// Selecteer alle boekoptieknoppen op de pagina
const bookButtons = document.querySelectorAll('.book-form-options button');

// Selecteer de winkelwagenknop
const cartButton = document.querySelector('.cart-button');

// Variabelen om de geselecteerde taal en het geselecteerde boek op te slaan
let selectedLanguage = null;
let selectedBook = null;

// Functie om de status van de winkelwagenknop bij te werken
// Schakelt de knop in als er zowel een taal als een boek is geselecteerd, anders schakelt het de knop uit
function updateCartButton() {
    if (selectedLanguage && selectedBook) {
        cartButton.disabled = false; // Schakel de winkelwagenknop in
    } else {
        cartButton.disabled = true;  // Schakel de winkelwagenknop uit
    }
}

// Voeg event listeners toe aan elke taaloptieknop
// Wanneer een knop wordt aangeklikt, sla de geselecteerde taal op en werk de winkelwagenknopstatus bij
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedLanguage = button.getAttribute('data-lang');  // Haal de taalgegevens van de knop op
        updateCartButton();  // Werk de status van de winkelwagenknop bij
    });
});

// Voeg event listeners toe aan elke boekoptieknop
// Wanneer een knop wordt aangeklikt, sla het geselecteerde boek op en werk de winkelwagenknopstatus bij
bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedBook = button.getAttribute('data-book');  // Haal de boekgegevens van de knop op
        updateCartButton();  // Werk de status van de winkelwagenknop bij
    });
});
