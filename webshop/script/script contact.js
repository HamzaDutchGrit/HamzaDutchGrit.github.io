function submitForm(event) {
    event.preventDefault(); // Voorkom dat het formulier standaard wordt verzonden

    // Haal de velden op
    const nameField = document.getElementById('name');
    const lastnameField = document.getElementById('lastname');
    const emailField = document.getElementById('email');
    const telephoneField = document.getElementById('telephone');

    // Validatie - Hier kun je extra validatie toevoegen als nodig
    if (!nameField.value || !lastnameField.value || !emailField.value || !telephoneField.value) {
        alert("Vul alle velden correct in.");
        return; // Stop hier als de validatie faalt
    }

    // Als alles goed is, verzend het formulier
    const formData = new FormData(document.getElementById('contactForm'));
    console.log('Formulier verzonden met:', Object.fromEntries(formData.entries()));
    // Navigeer naar request.html (of voer een andere actie uit)
    window.location.href = 'request.html';
}

window.onload = function() {
    const name = localStorage.getItem('name');
    const lastName = localStorage.getItem('lastname');
    const email = localStorage.getItem('email');
    const telephone = localStorage.getItem('telephone');
    // Hier kun je de gegevens weergeven
    document.getElementById('output').innerHTML = `
        <p>Name: ${name}</p>
        <p>Last Name: ${lastName}</p>
        <p>Email: ${email}</p>
        <p>Telephone: ${telephone}</p>
    `;
};