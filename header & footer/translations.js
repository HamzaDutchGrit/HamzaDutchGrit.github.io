// Voorkomt dat iconen vertaald worden en markeert ze als niet-betekenisvol voor vertaling
function preventIconTranslation() {
    // Zoek alle iconen op de pagina
    const icons = document.querySelectorAll(
        '.material-icons, ' + 
        '.material-symbols-outlined, ' + 
        '.material-symbols-rounded, ' + 
        '.material-symbols-sharp, ' + 
        '.material-symbols-two-tone, ' + 
        '.fa, ' + // Als je Font Awesome gebruikt
        '.icon-class' // Voeg hier je eigen icon-klassen toe, bijvoorbeeld voor andere icon bibliotheken
    );

    // Voeg translate="no" en aria-hidden="true" toe aan elk icoon
    icons.forEach(icon => {
        icon.setAttribute('translate', 'no');
        icon.setAttribute('aria-hidden', 'true');
    });
}

// Wacht totdat de pagina volledig geladen is en roep de vertaalfunctie aan
window.onload = function() {
    // Eerst de iconen uitsluiten van vertaling
    preventIconTranslation();
    
    // Google Translate initialisatie na het laden
    googleTranslateElementInit();
};

// Google Translate initialisatie
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',  // Zet de pagina taal op Engels
        includedLanguages: 'nl,en,es,de,sv,ja,hr',  // Talen waarin je wilt vertalen
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');
}

// Voorkomt dat de pagina omhoog springt bij het selecteren van een taal
document.addEventListener("DOMContentLoaded", function() {
    const translateElement = document.getElementById("google_translate_element");
    if (translateElement) {
        translateElement.addEventListener("click", function(event) {
            event.preventDefault();
        });
    }
});


