const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('./app');
const Rent = require('./models/rent');
const User = require('./models/user');
const Parking = require('./models/parking');
require('dotenv').config()


describe('GET /api/v2/rents', () => {
    let token;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');

        // Create valid token
        const payload = {
            id: '00000000000000000',
            email: 'test@mail.com',
            user_type: 'Proprietario'
        }
        const options = { expiresIn: 86400 }
        token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('GET /api/v2/rents with authenticated user', async () => {
        const response = await request(app)
            .get('/api/v2/rents')
            .set('X-access-token', token)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    test('GET /api/v2/rents without authentication', async () => {
        const response = await request(app)
            .get('/api/v2/rents')

        expect(response.statusCode).toBe(401);
    })
});

describe('POST /api/v2/rents', () => {
    let token;
    let parking;
    let user;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');

        // Create valid token
        const payload = {
            id: '00000000000000000',
            email: 'test@mail.com',
            user_type: 'Proprietario'
        }
        const options = { expiresIn: 86400 }
        token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        // Create a test user
        user = new User({
            type: 'Proprietario',
            email: 'test@mail.com',
            username: 'test',
            password: await bcrypt.hash('test', 10)
        });
        await user.save();
        // Create a test parking
        parking = new Parking({
            name: 'testParking',
            fee: 1,
            maxStop: 90,
            open: true,
            coordinates: { nord: 12.3456, est: 12.3456 },
            nParkingSpaces: 10,
            vehicleType: 'Automobile',
            nFree: 10
        });
        await parking.save();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('POST /api/v2/rents with user Proprietario', async () => {
        const response = await request(app)
            .post('/api/v2/rents')
            .set('X-access-token', token)
            .send({
                userId: user.id,
                parkingId: parking.id
            })

        expect(response.statusCode).toBe(200);
    })

    test('POST /api/v2/rents with user Consumer', async () => {
        // Create valid token
        const payload = {
            id: '00000000000000001',
            email: 'test2@mail.com',
            user_type: 'Consumer'
        }
        const options = { expiresIn: 86400 }
        const token2 = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app)
            .post('/api/v2/rents')
            .set('X-access-token', token2)
            .send({
                parkingId: parking.id
            })

        expect(response.statusCode).toBe(403);
    })

    test('POST /api/v2/rents without parkingId', async () => {
        const response = await request(app)
            .post('/api/v2/rents')
            .set('X-access-token', token)

        expect(response.statusCode).toBe(400);
    })

    test('POST /api/v2/rents with parkingId already rented', async () => {
        // Create a test rent
        const rent = new Rent({
            userId: user.id,
            parkingId: parking.id,
            approved: false
        });
        await rent.save();

        const response = await request(app)
            .post('/api/v2/rents')
            .set('X-access-token', token)
            .send({
                parkingId: parking.id
            })

        expect(response.statusCode).toBe(400);
    })
});

describe('DELETE /api/v2/rents/:rentId', () => {
    let token;
    let parking;
    let user;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');

        // Create a test user
        user = new User({
            type: 'Proprietario',
            email: 'test@mail.com',
            username: 'test',
            password: await bcrypt.hash('test', 10)
        });
        await user.save();
        // Create a test parking
        parking = new Parking({
            name: 'testParking',
            fee: 1,
            maxStop: 90,
            open: true,
            coordinates: { nord: 12.3456, est: 12.3456 },
            nParkingSpaces: 10,
            vehicleType: 'Automobile',
            nFree: 10
        });
        await parking.save();

        // Create valid token
        const payload = {
            id: user.id,
            email: 'test@mail.com',
            user_type: 'Proprietario'
        }
        const options = { expiresIn: 86400 }
        token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('DELETE /api/v2/rents with authenticaed user', async () => {
        // Create a test rent
        const rent = new Rent({
            userId: user.id,
            parkingId: parking.id,
            approved: false
        });
        await rent.save();

        const response = await request(app)
            .delete('/api/v2/rents/' + rent.id)
            .set('X-access-token', token)

        expect(response.statusCode).toBe(200);
    })

    test('DELETE /api/v2/rents with user that is not the authenticaed one', async () => {
        // Create a test rent
        const rent = new Rent({
            userId: user.id,
            parkingId: parking.id,
            approved: false
        });
        await rent.save();
        // Create valid token
        const payload = {
            id: '00000000000000002',
            email: 'test2@mail.com',
            user_type: 'Proprietario'
        }
        const options = { expiresIn: 86400 }
        const token2 = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app)
            .delete('/api/v2/rents/' + rent.id)
            .set('X-access-token', token2)

        expect(response.statusCode).toBe(403);
    })

    test('DELETE /api/v2/rents with non existing rent', async () => {
        const response = await request(app)
            .delete('/api/v2/rents/66587be7c7c1a1e9d52749d1')
            .set('X-access-token', token)

        expect(response.statusCode).toBe(404);
    })
});
