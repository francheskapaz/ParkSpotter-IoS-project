document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const parkingId = document.getElementById('parking-id').value;
    const timeStart = document.getElementById('time-start').value;
    const timeEnd = document.getElementById('time-end').value;

    fetch(`http://localhost:3000/${parkingId}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeStart, timeEnd }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('message').textContent = data.error;
        } else {
            document.getElementById('message').textContent = data.message;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
