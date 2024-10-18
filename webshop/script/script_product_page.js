async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const productCode = params.get('code');

    if (!productCode) {
        console.error("Geen productcode in de URL gevonden.");
        return;
    }

    try {
        const response = await fetch('../webshop/products.json');
        const data = await response.json();
        const products = Object.values(data.discipline_group).flat();

        console.log("Gelaadde producten:", products);

        const product = products.find(p => p.code === productCode);

        if (product) {
            document.getElementById('product-title').innerText = product.product;
            document.getElementById('product-description').innerText = product.long_description;

            const productImage = document.querySelector('.product-image img');
            productImage.src = product.image;

            // Update de URL met de nieuwe productcode zonder de pagina opnieuw te laden
            const newUrl = `${window.location.pathname}?code=${product.code}`;
            window.history.pushState({ path: newUrl }, '', newUrl);

            console.log("Gevonden product:", product);
        } else {
            console.error("Product niet gevonden voor code: " + productCode);
        }
    } catch (error) {
        console.error("Fout bij het laden van producten:", error);
    }
}

window.onload = loadProduct;
