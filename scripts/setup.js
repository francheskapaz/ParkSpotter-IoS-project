
require('dotenv').config()
const mongoose = require('mongoose');
var Parking  = require('../app/models/parking.js')

var Feedback = require('../app/models/feedback.js')


// connect to database
mongoose.connect(process.env.DB_URL)
    .then( () => {
        console.log("Connected to Database");
    });

// Add example parkings
Parking.deleteMany({}) // Clear collection
    .then(() => {
        // Example parkings from https://dati.trentino.it/dataset/parcheggio-protetto-per-biciclette-open-data
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
        return Parking.find({});
    }). then ((parkings) => {
        console.log('All parkings: ', parkings);
        process.exit()
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });

Feedback.deleteMany({}) // Clear collection
.then(() => {
    console.log('Feedback collection cleared');
    return Parking.find({}).limit(2);
})
.then(parking => {
    if (!parking) {
        throw new Error('No parkings found in the database');
    }
    const userId1 = '60c72b2f9b1d4c3b3c1a7b3f' //example of user ID
    const userId2 = '60c72b2f9b1d4c3b3c1a7b4f'
    const userId3 = '60c72b2f9b1d4c3b3c1a7b7b'
    const parkingId1 = parking[0]._id
    const parkingId2 = parking[1]._id

    const feedbacks = [
        new Feedback({
            user_id: userId1,
            parking_id: parkingId1,
            score: 5,
            comment: 'Great parking spot, very convenient!',
            date: new Date('2024-05-06T10:00:00Z')
        }),
        new Feedback({
            user_id: userId2,
            parking_id: parkingId2,
            score: 3,
            comment: 'Good parking spot, but could be cleaner',
            date: new Date('2024-05-06T15:00:00Z')
        }),
        new Feedback({
            user_id: userId3,
            parking_id: parkingId1,
            score: 3,
            comment: 'Average parking experience.',
            date: new Date('2024-05-06T15:30:00Z')
        })
    ];
    return Feedback.insertMany(feedbacks);
})
.then(feedbacks => {
    console.log('Feedbacks saved successfully', feedbacks);
    
})