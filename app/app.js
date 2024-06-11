const express = require('express');
const router = express.Router();
const Parking = require('./models/parking.js'); // Importa il modello Parking

// Funzione helper per verificare se due intervalli di tempo si sovrappongono
function overlaps(timeStart1, timeEnd1, timeStart2, timeEnd2) {
    return timeStart1 < timeEnd2 && timeStart2 < timeEnd1;
}

// Crea una nuova prenotazione
router.post('/:id/reservations', async (req, res) => {
    const { id } = req.params;
    const { timeStart, timeEnd } = req.body;

    // Verifica che il tempo di inizio e di fine della prenotazione siano validi
    if (new Date(timeEnd) <= new Date(timeStart)) {
        return res.status(400).json({ error: 'Il tempo di fine prenotazione deve essere successivo al tempo di inizio prenotazione' });
    }

    try {
        const parking = await Parking.findOne({ name: name });
        if (!parking) {
            return res.status(404).json({ message: 'Parcheggio non trovato' });
        }

        // Calcola la somma totale delle tariffe
        let totalFee = 0;
        for (let reservation of parking.reservations) {
            totalFee += reservation.fee;
        }

        res.json({ totalFee });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server interno', details: error });
    }
});

// Modifica una prenotazione esistente
router.put('/:id/reservations/:resId', async (req, res) => {
    const { id, resId } = req.params;
    const { timeStart, timeEnd } = req.body;

    // Verifica che il tempo di inizio e di fine della prenotazione siano validi
    if (new Date(timeEnd) <= new Date(timeStart)) {
        return res.status(400).json({ error: 'Il tempo di fine prenotazione deve essere successivo al tempo di inizio prenotazione' });
    }

    try {
        const parking = await Parking.findOne({ name: name });
        if (!parking) {
            return res.status(404).json({ message: 'Parcheggio non trovato' });
        }

        // Calcola la nuova somma totale delle tariffe
        let newTotalFee = 0;
        for (let reservation of parking.reservations) {
            newTotalFee += reservation.fee;
        }

        // Aggiorna la somma totale delle tariffe
        parking.totalFee = newTotalFee;

        // Salva il parcheggio aggiornato
        await parking.save();

        res.json({ message: 'Prenotazione modificata con successo', parking });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server interno', details: error });
    }
});

// Cancella una prenotazione
router.delete('/:id/reservations/:resId', async (req, res) => {
    const { id, resId } = req.params;

    try {
        const parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: 'Parcheggio non trovato' });
        }

        // Rimuovi la prenotazione
        parking.reservations.id(resId).remove();

        // Aggiorna il numero di posti di parcheggio disponibili
        parking.nFree++;

        // Salva il parcheggio aggiornato
        await parking.save();

        res.json({ message: 'Prenotazione cancellata con successo', parking });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server interno', details: error });
    }
});

// Ottieni tutte le prenotazioni di un parcheggio
router.get('/:id/reservations', async (req, res) => {
    const { id } = req.params;

    try {
        const parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: 'Parcheggio non trovato' });
        }

        res.json(parking.reservations);
    } catch (error) {
        res.status(500).json({ error: 'Errore del server interno', details: error });
    }
});

module.exports = router;
