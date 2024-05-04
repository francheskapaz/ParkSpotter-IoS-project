require('dotenv').config()

var Parking = require('../app/models/parking');

var mongoose = require('mongoose');
// connect to database
mongoose.connect(process.env.DB_URL)
    .then( () => {
        console.log("Connected to Database");
    });

// Clear the collection
Parking.deleteMany({})
    .then(() => {
        // Example parkingss from https://dati.trentino.it/dataset/parcheggio-protetto-per-biciclette-open-data
        var parkingOne = new Parking({
            name: "Area Ex Zuffo",
            fee: 0,
            maxStop: 0,
            open: true,
            coordinates: {
                nord: 663196.778521093423478,
                est: 5104562.439772779121995
            },
            nParkingSpaces: 204,
            vehicleType: "Bike",
            nFree: 155,
            reservations: [
                {
                    timeStart: new Date('2024-05-06T10:00:00Z'),
                    timeEnd: new Date('2024-05-06T11:00:00Z')
                },
                {
                    timeStart: new Date('2024-05-06T15:00:00Z'),
                    timeEnd: new Date('2024-05-06T15:30:00Z')
                }
            ]
        });
        return parkingOne.save()
    }).then(() => {
        console.log('Parking 1 saved successfully');
    }).then(() => {
        var parkingTwo = new Parking({
            name: "Piedicastello",
            fee: 0,
            maxStop: 0,
            open: true,
            coordinates: {
                nord: 663454.116794560686685,
                est: 5104019.042824324220419
            },
            nParkingSpaces: 26,
            vehicleType: "Bike",
            nFree: 12,
            reservations: []
        });
        return parkingTwo.save()
    }).then(() => {
        console.log('Parking 2 saved successfully');
        process.exit();
    })

