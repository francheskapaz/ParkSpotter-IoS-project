document.getElementById('feeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const parkingName = document.getElementById('parkingName').value;
    fetch(`http://localhost:8080/api/parking/${parkingName}/totalFee`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalFee').textContent = 'La somma totale delle tariffe è: ' + data.totalFee;
        })
        .catch(error => {
            console.error('Errore:', error);
        });
});
