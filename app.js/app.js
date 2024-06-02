const express = require('express');
const { connectDB, Prenotazione } = require('./db');
const app = express();

app.use(express.json());

connectDB();

// Nuova prenotazione 
app.post('/api/prenotazioni', async (req, res) => {
  const { idParcheggio, nomeCliente } = req.body;
  const nuovaPrenotazione = new Prenotazione({
    id: idParcheggio,
    nome: 'Parcheggio ' + idParcheggio,
    disponibile: false,
    nomeCliente: nomeCliente
  });

  try {
    await nuovaPrenotazione.save();
    res.status(201).json({ message: 'Prenotazione effettuata con successo', prenotazione: nuovaPrenotazione });
  } catch (err) {
    res.status(500).json({ message: 'Si è verificato un errore durante la creazione della prenotazione', error: err });
  }
});

// Aggiornamento prenotazione
app.put('/api/prenotazioni/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { idParcheggio, nomeCliente } = req.body;

  try {
    const prenotazione = await Prenotazione.findOneAndUpdate(
      { id: id },
      { id: idParcheggio, nome: 'Parcheggio ' + idParcheggio, disponibile: false, nomeCliente: nomeCliente },
      { new: true }
    );

    if (!prenotazione) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    res.status(200).json({ message: 'Prenotazione aggiornata con successo', prenotazione: prenotazione });
  } catch (err) {
    res.status(500).json({ message: 'Si è verificato un errore durante aggiornamento della prenotazione', error: err });
  }
});

// Cancellazione prenotazione
app.delete('/api/prenotazioni/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const prenotazione = await Prenotazione.findOneAndDelete({ id: id });

    if (!prenotazione) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    res.status(200).json({ message: 'Prenotazione cancellata con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Si è verificato un errore durante la cancellazione della prenotazione', error: err });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Si è verificato un errore!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
