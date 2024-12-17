// Add an event listener to detect when the user scrolls
window.addEventListener("scroll", function() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn"); // Select the "scroll to top" button
    // Check if the page has been scrolled more than 200px
    if (window.scrollY > 200) {
        scrollToTopBtn.classList.add("show"); // Show the button when scrolled past 200px
    } else {
        scrollToTopBtn.classList.remove("show"); // Hide the button when the scroll position is less than 200px
    }
});

// Add an event listener for the "scroll to top" button's click event
document.getElementById("scrollToTopBtn").addEventListener("click", function() {
    // Scroll smoothly to the top of the page
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
