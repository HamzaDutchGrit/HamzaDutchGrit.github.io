// Functie om het aantal uit localStorage te halen en bij te werken
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Haal cart op uit localStorage
    return cart.length; // Geef het aantal items in de cart terug
}

// Update het aantal in het winkelwagen-icoon
function updateCartCountDisplay() {
    const cartCount = document.getElementById('cart-count');
    const count = getCartCount(); // Verkrijg het aantal items in de cart

    if (count > 99) {
        cartCount.textContent = '99+'; // Toon 99+ als het groter is dan 100
    } else {
        cartCount.textContent = count; // Toon het echte aantal
    }

    // Toon of verberg de cirkel op basis van de waarde van count
    if (count > 0) {
        cartCount.style.display = 'flex'; // Toon de cirkel
    } else {
        cartCount.style.display = 'none'; // Verberg de cirkel als count 0 is
    }
}

// Functie die wordt aangeroepen bij het klikken op de winkelwagenknop
function cartIcon(event) {
    event.preventDefault(); // Voorkom pagina navigatie

    // Voorbeeld product dat aan de cart wordt toegevoegd
    const newItem = {
        title: 'Product 1',
        price: '20',
        id: '1'
    };

    // Haal de huidige cart uit localStorage, of start met een lege array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(newItem); // Voeg het nieuwe item toe aan de cart

    // Sla de bijgewerkte cart op in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update de weergave van het winkelwagen-icoon
    updateCartCountDisplay();
}

// Roep deze functie aan om het aantal in de winkelwagen-icoon te tonen wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);