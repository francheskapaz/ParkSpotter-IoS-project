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
        const parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: 'Parcheggio non trovato' });
        }

        // Verifica che ci siano posti di parcheggio disponibili
        if (parking.nFree <= 0) {
            return res.status(400).json({ error: 'Non ci sono posti di parcheggio disponibili' });
        }

        // Verifica che il tempo di prenotazione non si sovrapponga con prenotazioni esistenti
        for (let reservation of parking.reservations) {
            if (overlaps(timeStart, timeEnd, reservation.timeStart, reservation.timeEnd)) {
                return res.status(400).json({ error: 'Il tempo di prenotazione si sovrappone con una prenotazione esistente' });
            }
        }

        // Calcola la tariffa in base al tempo di prenotazione
        const duration = (new Date(timeEnd) - new Date(timeStart)) / (1000 * 60 * 60); // Durata in ore
        const fee = duration * parking.fee; // Tariffa = durata * tariffa oraria

        // Aggiungi la nuova prenotazione
        parking.reservations.push({ timeStart, timeEnd, fee });

        // Aggiorna il numero di posti di parcheggio disponibili
        parking.nFree--;

        // Salva il parcheggio aggiornato
        await parking.save();

        res.status(201).json({ message: 'Prenotazione creata con successo', parking });
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
        const parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: 'Parcheggio non trovato' });
        }

        // Trova la prenotazione da modificare
        const reservation = parking.reservations.id(resId);
        if (!reservation) {
            return res.status(404).json({ message: 'Prenotazione non trovata' });
        }

        // Verifica che il nuovo tempo di prenotazione non si sovrapponga con altre prenotazioni esistenti
        for (let otherReservation of parking.reservations) {
            if (otherReservation._id !== reservation._id && overlaps(timeStart, timeEnd, otherReservation.timeStart, otherReservation.timeEnd)) {
                return res.status(400).json({ error: 'Il nuovo tempo di prenotazione si sovrappone con una prenotazione esistente' });
            }
        }

        // Modifica la prenotazione
        reservation.timeStart = timeStart;
        reservation.timeEnd = timeEnd;

        // Aggiorna la tariffa della prenotazione
        const duration = (new Date(timeEnd) - new Date(timeStart)) / (1000 * 60 * 60); // Durata in ore
        reservation.fee = duration * parking.fee; // Tariffa = durata * tariffa oraria

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
