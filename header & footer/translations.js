// Google Translate initialization
function googleTranslateElementInit() {
    // Initialize the Google Translate widget with specified options
    new google.translate.TranslateElement({
        pageLanguage: 'en',  // Set the page language to English
        includedLanguages: 'bg,cs,da,de,el,en,es,et,fi,fr,hr,hu,it,lv,lt,mt,nl,no,pl,pt,ro,sk,sl,sv,tr,uk,ru,zh-CN,zh-TW,ja,ko,hi,ar,he,id,ms,th,vi,fa',  // List of languages to include in the translate dropdown
        autoDisplay: false,  // Prevent automatic language selection display
        multilanguagePage: true  // Enable multilanguage page behavior
    }, 'google_translate_element'); // Attach the translate element to the div with the id 'google_translate_element'

    // Hide the translate banner once the translation button is loaded
    var translateFrame = document.querySelector('.goog-te-banner-frame');
    if (translateFrame) {
        translateFrame.style.display = 'none'; // Directly hide the banner after loading
    }
}

// Prevent the page from scrolling up when selecting a language
document.addEventListener("DOMContentLoaded", function() {
    const translateElement = document.getElementById("google_translate_element");
    if (translateElement) {
        translateElement.addEventListener("click", function(event) {
            event.preventDefault();  // Prevent default action of the click event to avoid page scroll
        });
    }
});
