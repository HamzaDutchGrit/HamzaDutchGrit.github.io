function hidePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    popup.classList.add('hide');
    overlay.classList.add('hide');

    setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }, 300); // Match this duration with your CSS transition duration
}

function showPopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    popup.style.display = 'block';
    overlay.style.display = 'flex';

    setTimeout(() => {
        popup.classList.remove('hide');
        overlay.classList.remove('hide');
    }, 10); // Allows for the CSS to take effect
}
