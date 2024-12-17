function sendAnalytics(buttonName) {
    console.log(`Button clicked: ${buttonName}`); // Log the name of the button clicked

    const apiUrl = `${API_URL.accounts}analytics`; // The API URL for sending analytics data

    const payload = {
        button: buttonName, // The name of the button being tracked
        amount: 1 // The amount, in this case always 1 (indicating one click)
    };

    fetch(apiUrl, {
        method: 'POST', // Send the request as a POST method
        headers: {
            'Content-Type': 'application/json' // Set the content-type header to JSON
        },
        body: JSON.stringify(payload) // Convert the payload object into a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText); // Handle errors if response is not OK
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        console.log("Analytics data sent successfully", data); // Log the successful response from the server
    })
    .catch(error => {
        console.error("An error occurred while sending analytics data:", error); // Log any errors that occur during the fetch process
    });
}
