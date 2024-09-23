// Popup tonen
function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

// Popup sluiten
document.querySelector('.popup-close').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

// Simuleer het openen van de popup voor testdoeleinden
window.onload = function() {
    showPopup();
};
