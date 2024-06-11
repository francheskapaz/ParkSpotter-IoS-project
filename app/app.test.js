const request = require('supertest');
const app = require('./app'); // Importa il tuo server Express
const Parking = require('./models/parking.js'); // Importa il modello Parking
const prenotazioni = require('./prenotazioni.js'); // Importa le prenotazioni di esempio

// Carica le prenotazioni nel database
beforeEach(async () => {
    for (let prenotazione of prenotazioni) {
        const parking = await Parking.findOne({ name: prenotazione.parkingName });
        if (parking) {
            parking.reservations.push({
                timeStart: prenotazione.timeStart,
                timeEnd: prenotazione.timeEnd,
                fee: prenotazione.fee
            });
            await parking.save();
        }
    }
}, 10000);

// Rimuovi le prenotazioni dal database
afterEach(async () => {
    for (let prenotazione of prenotazioni) {
        const parking = await Parking.findOne({ name: prenotazione.parkingName });
        if (parking) {
            parking.reservations = [];
            await parking.save();
        }
    }
}, 10000);

// Testa l'API GET /:name/totalFee
test('GET /:name/totalFee', async () => {
    for (let prenotazione of prenotazioni) {
        const response = await request(app).get(`/api/${prenotazione.parkingName}/totalFee`);
        expect(response.status).toBe(200);

        let totalFee = 0;
        for (let otherPrenotazione of prenotazioni) {
            if (otherPrenotazione.parkingName === prenotazione.parkingName) {
                totalFee += otherPrenotazione.fee;
            }
        }

        expect(response.body.totalFee).toBe(totalFee);
    }
}, 10000);

// Testa l'API PUT /:name/updateTotalFee
test('PUT /:name/updateTotalFee', async () => {
    for (let prenotazione of prenotazioni) {
        const response = await request(app).put(`/api/${prenotazione.parkingName}/updateTotalFee`);
        expect(response.status).toBe(200);

        let totalFee = 0;
        for (let otherPrenotazione of prenotazioni) {
            if (otherPrenotazione.parkingName === prenotazione.parkingName) {
                totalFee += otherPrenotazione.fee;
            }
        }

        expect(response.body.parking.totalFee).toBe(totalFee);
    }
}, 10000);
