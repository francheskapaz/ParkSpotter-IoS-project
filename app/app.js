// Ottieni la somma totale delle tariffe di un parcheggio
router.get('/:id/totalFee', async (req, res) => {
    const { id } = req.params;

    try {
        const parking = await Parking.findById(id);
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

// Aggiorna la somma totale delle tariffe di un parcheggio
router.put('/:id/updateTotalFee', async (req, res) => {
    const { id } = req.params;

    try {
        const parking = await Parking.findById(id);
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

        res.json({ message: 'Somma totale delle tariffe aggiornata con successo', parking });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server interno', details: error });
    }
});
