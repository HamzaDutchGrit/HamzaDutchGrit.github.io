let count = 0; // Initialize the count

function cartIcon(event) {
    console.log("test")
    event.preventDefault(); // Voorkom dat de knop naar een andere pagina leidt
    count++; // Verhoog de count met 1
    const cartCount = document.getElementById('cart-count'); // Selecteer het juiste element

    // Controleer of de count groter is dan 100
    if (count > 99) {
        cartCount.textContent = '99+'; // Zet de tekst op 99+ als het groter is dan 100
    } else {
        cartCount.textContent = count; // Anders toon het werkelijke aantal
    }

    // Toon de cirkel als count groter is dan 0
    if (count > 0) {
        cartCount.style.display = 'flex'; // Toon de cirkel
    }
}
