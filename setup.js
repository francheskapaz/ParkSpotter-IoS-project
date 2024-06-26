
require('dotenv').config();

var Parking  = require('./app/models/parking.js')
var Feedback = require('./app/models/feedback.js')
const mongoose = require('mongoose');

//const DB_URL = 'mongodb+srv://mongoadmin:OTPk5CLSW4fJfeY3@cluster0.twbxma1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_URL = process.env.DB_URL;
console.log('DB_URL:', DB_URL);



// connect to database
mongoose.connect(DB_URL, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000,
})
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
            ],
            averageScore: 0
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
            reservations: [],
            averageScore: 0
        });
        return parkingTwo.save()
    }).then(() => {
        console.log('Parking 2 saved successfully');
        return Parking.find({});
    }). then ((parkings) => {
        console.log('All parkings: ', parkings);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });

// Add example feedbacks
Feedback.deleteMany({}) // Clear collection
.then(() => {
    console.log('Feedback collection cleared');
    return Parking.find({}).limit(2);
})
.then(parking => {
    if (!parking) {
        throw new Error('No parkings found in the database');
    }
    const userId1 = new mongoose.Types.ObjectId() // Generate ObjectId dynamically
    const userId2 = new mongoose.Types.ObjectId()
    const userId3 = new mongoose.Types.ObjectId()
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
    return Feedback.find({}).populate('parking_id');
})
. then (feedbacks => {
    console.log('All parkings: ', feedbacks);
    process.exit()
})
.catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});