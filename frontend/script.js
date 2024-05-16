// Funzione per caricare i parcheggi dal backend e popolare la tabella
async function caricaParcheggi() {
    try {
        const response = await fetch('/api/parcheggi');
        const parcheggi = await response.json();

        const tableBody = document.querySelector('#parcheggi-table tbody');
        tableBody.innerHTML = '';

        parcheggi.forEach(parcheggio => {
            const row = `
                <tr>
                    <td>${parcheggio.id}</td>
                    <td>${parcheggio.nome}</td>
                    <td>${parcheggio.disponibile ? 'Sì' : 'No'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Si è verificato un errore durante il caricamento dei parcheggi:', error);
    }
}

// Funzione per gestire l'invio del form di prenotazione
document.getElementById('prenotazione-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const nome = formData.get('nome');
    const idParcheggio = formData.get('parcheggio');

    try {
        const response = await fetch('/api/prenotazioni', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idParcheggio,
                nomeCliente: nome
            })
        });
        const data = await response.json();
        console.log(data.message);

        // Aggiorna la tabella dei parcheggi dopo aver effettuato la prenotazione
        caricaParcheggi();
    } catch (error) {
        console.error('Si è verificato un errore durante la prenotazione del parcheggio:', error);
    }
});

// Carica i parcheggi quando la pagina viene caricata
window.addEventListener('load', caricaParcheggi);
