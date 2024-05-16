// Importa Express
const express = require('express');
const app = express();

// Esempio dati
const parcheggi = [
  { id: 1, nome: 'Parcheggio A', disponibile: true },
  { id: 2, nome: 'Parcheggio B', disponibile: false },
];

// Route per la creazione di una nuova prenotazione
app.post('/api/prenotazioni', (req, res) => {
  // Dati inviati dal client per la nuova prenotazione
  const { idParcheggio, nomeCliente } = req.body;

  // Trova il parcheggio corrispondente all'ID
  const parcheggio = parcheggi.find(p => p.id === idParcheggio);

  // Verifica se il parcheggio esiste e è disponibile
  if (!parcheggio) {
    return res.status(404).json({ error: 'Parcheggio non trovato' });
  }

  if (!parcheggio.disponibile) {
    return res.status(400).json({ error: 'Il parcheggio non è disponibile' });
  }

  // Effettua la prenotazione
  parcheggio.disponibile = false;
  parcheggio.nomeCliente = nomeCliente;

  // Puoi qui salvare questa prenotazione in un database o in un file, ad esempio

  // Invia una risposta di conferma al client
  res.status(201).json({ message: 'Prenotazione effettuata con successo', parcheggio });
});

// Avvia il server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
