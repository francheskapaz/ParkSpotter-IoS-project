const request = require('supertest');
const app = require('./server.js'); // Importa l'app Express

let server;

// Avvia il server prima dei test
beforeAll(() => {
  server = app.listen(8080, () => {
    console.log("Server in esecuzione sulla porta 8080");
  });
});

// Arresta il server dopo i test
afterAll((done) => {
  server.close(done);
});

describe('POST /api/parking/:id/reservations', () => {
    it('dovrebbe creare una nuova prenotazione', async () => {
        const id = '6666ca5472481d0a81efeaeb';
        const newReservation = {
            timeStart: new Date('2024-05-06T16:00:00Z'),
            timeEnd: new Date('2024-05-06T17:00:00Z')
        };

        const response = await request(server)
            .post(`/api/parking/${id}/reservations`)
            .send(newReservation);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Prenotazione creata con successo');
        expect(response.body.parking.reservations).toContainEqual(expect.objectContaining(newReservation));
    }, 100000); // Imposta un timeout di 10 secondi per questo test
});
