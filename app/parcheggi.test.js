const request = require('supertest');
const app = require('./app.js'); 
const mongoose = require('mongoose');
const Parking = require('./models/parking.js');
const e = require('cors');
DB_URL = process.env.DB_URL || 'mongodb+srv://mongoadmin:OTPk5CLSW4fJfeY3@cluster0.twbxma1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
require('dotenv').config();


describe('GET /api/v2/parkings', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    app.locals.db = await mongoose.connect(`${DB_URL}/testdb`)
    console.log('DB connected');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });
    afterEach(async () => {
        await Parking.deleteMany({});
    });

  
    test('GET /api/v2/parkings with existing parkings', async () => {
      const initialParkings = [
        {
          name: "Parking Lot Test 1",
          fee: 0,
          maxStop: 0,
          open: true,
          coordinates: { nord: 663196.778521093423478, est: 5104562.439772779121995 },
          nParkingSpaces: 100,
          vehicleType: "Car",
          nFree: 20,
          reservations: [],
          averageScore: 0
        },
        {
          name: "Parking Lot Test 2",
          fee: 0,
          maxStop: 0,
          open: true,
          coordinates: { nord: 663196.778521093423478, est: 5104562.439772779121995 },
          nParkingSpaces: 100,
          vehicleType: "Car",
          nFree: 20,
          reservations: [],
          averageScore: 0
        }
      ];
      await Parking.insertMany(initialParkings);

      const response = await request(app)
        .get('/api/v2/parkings');

      console.log(response.body);
      expect(response.statusCode).toBe(200);
      //expect(response.body.length).toBe(initialParkings.length);

    });
});


describe('GET /api/v2/parkings/:id', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    app.locals.db = await mongoose.connect(`${DB_URL}/testdb`)
    console.log('DB connected');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });
    afterEach(async () => {
        await Parking.deleteMany({});
    });

    test('GET /api/v2/parkings/:id', async () => {
      const newParking = new Parking({
        name: "Parking Lot Test",
        fee: 0,
        maxStop: 0,
        open: true,
        coordinates: { nord: 663196.778521093423478, est: 5104562.439772779121995 },
        nParkingSpaces: 100,
        vehicleType: "Car",
        nFree: 20,
        reservations: [],
        averageScore: 0
      });
      await newParking.save();
    
      
      const response = await request(app)
        .get(`/api/v2/parkings/${newParking._id}`);
      console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBe(newParking._id.toString()); // Verify that the returned parking has the same id as the one we created
      
    });

});

describe('POST /api/v2/parkings', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    app.locals.db = await mongoose.connect(`${DB_URL}/testdb`)
    console.log('DB connected');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });
    afterEach(async () => {
        await Parking.deleteMany({});
    });
    test('POST /api/v2/parkings with valid data', async () => {
      const response = await request(app)
        .post('/api/v2/parkings')
        .send({
            name: "Parking Lot Test",
            fee: 0,
            maxStop: 0,
            open: true,
            coordinates: { nord: 663196.778521093423478, est: 5104562.439772779121995 },
            nParkingSpaces: 100,
            vehicleType: "Car",
            nFree: 20,
            reservations: [],
            averageScore: 0
      });
      console.log('response.body:', response.body);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Parking created successfully');
      expect(response.body.parking).toHaveProperty('_id');
  });
});

describe('PATCH /api/v2/parkings/:id', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    app.locals.db = await mongoose.connect(`${DB_URL}/testdb`)
    console.log('DB connected');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });
    afterEach(async () => {
        await Parking.deleteMany({});
    });

    test('PATCH /api/v2/parkings/:id with valid data', async () => {
      const initialParking = new Parking({
        name: "Parking Lot Test",
        fee: 0,
        maxStop: 0,
        open: true,
        coordinates: { nord: 663196.778521093423478, est: 5104562.439772779121995 },
        nParkingSpaces: 100,
        vehicleType: "Car",
        nFree: 20,
        reservations: [],
        averageScore: 0
      });
      await initialParking.save();

      const updateParkingData = {
        fee: 5,
        nFree: 15
      }

      const response = await request(app)
        .patch(`/api/v2/parkings/${initialParking._id}`)
        .send(updateParkingData);
      console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Parking updated successfully');
      expect(response.body.parking).toHaveProperty('_id');
    });
});

describe('DELETE /api/v2/parkings/:id', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    app.locals.db = await mongoose.connect(`${DB_URL}/testdb`)
    console.log('DB connected');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });
    afterEach(async () => {
        await Parking.deleteMany({});
    });
    test('DELETE /api/v2/parkings/:id with valid id', async () => {
      const initialParking = new Parking({
        name: "Parking Lot Test",
        fee: 0,
        maxStop: 0,
        open: true,
        coordinates: { nord: 663196.778521093423478, est: 5104562.439772779121995 },
        nParkingSpaces: 100,
        vehicleType: "Car",
        nFree: 20,
        reservations: [],
        averageScore: 0
      });
      await initialParking.save();

      const response = await request(app)
        .delete(`/api/v2/parkings/${initialParking._id}`)
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Parking deleted');

      // Verify that the parking was actually deleted
      const deletedParking = await Parking.findById(initialParking._id);
      expect(deletedParking).toBeNull();
    });

});