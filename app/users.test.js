const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config()


describe('POST /api/v1/users', () => {

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');
        console.log('Database connected!');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });

    afterEach(async () => {
        // Clear the database after each test
        await User.deleteMany({});
    })

    test('POST /api/v1/users with valid data', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                type: 'Consumer',
                email: 'test1@mail.com',
                username: 'test1',
                password: 'test1'
            })
        expect(response.statusCode).toBe(201);
        expect(response.headers.location).toMatch(/\/api\/v1\/users\/[0-9a-f]+/i);
    });

    test('POST /api/v1/users with invalid email', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                type: 'Consumer',
                email: 'test2"\'@mail.com',
                username: 'test2',
                password: 'test2'
            })
        expect(response.statusCode).toBe(400);
    });

    test('POST /api/v1/users with already registered username', async () => {
        // Create the user
        const user = new User({
            type: 'Consumer',
            email: 'test3@mail.com',
            username: 'test3',
            password: 'test3'
        });
        await user.save();

        const response = await request(app)
            .post('/api/v1/users')
            .send({
                type: 'Consumer',
                email: 'test3@mail.com',
                username: 'test3',
                password: 'test3'
            })
        expect(response.statusCode).toBe(400);
    });

    test('POST /api/v1/users with empty username', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                type: 'Consumer',
                email: 'test4@mail.com',
                password: 'test4'
            })
        expect(response.statusCode).toBe(400);
    });

    test('POST /api/v1/users with empty password', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                type: 'Consumer',
                email: 'test5@mail.com',
                username: 'test5'
            })
        expect(response.statusCode).toBe(400);
    });

    test('POST /api/v1/users with empty type', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .send({
                email: 'test6@mail.com',
                username: 'test6',
                password: 'test6'
            })
        expect(response.statusCode).toBe(400);
    });
});

describe('GET /api/v1/users/:userId', () => {
    let user;
    let token;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');
        console.log('Database connected!');

        // Create a test user
        user = new User({
            type: 'Consumer',
            email: 'test@mail.com',
            username: 'test7',
            password: 'test7'
        });
        await user.save();

        // Create valid token
        const payload = {
            id: user.id,
            email: user.email,
            user_type: user.type
        }
        const options = { expiresIn: 86400 }
        token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    });

    afterAll(async () => {
        // Clear the database
        await User.deleteMany({});
        await mongoose.connection.close();
        console.log('Database connection closed');
    });

    test('GET /api/v1/users/:userId with valid token', async () => {
        const response = await request(app)
            .get('/api/v1/users/' + user.id)
            .set('X-access-token', token)

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('self');
    });

    test('GET /api/v1/users/:userId without valid token', async () => {
        const response = await request(app)
            .get('/api/v1/users/' + user.id)

        expect(response.statusCode).toBe(401);
    });
});

describe('DELETE /api/v1/users/:userId', () => {
    let user;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');
        console.log('Database connected!');

        // Create a test user
        user = new User({
            type: 'Consumer',
            email: 'test8@mail.com',
            username: 'test8',
            password: 'test8'
        });
        await user.save();
    });

    afterAll(async () => {
        // Clear the database
        await User.deleteMany({});
        await mongoose.connection.close();
        console.log('Database connection closed');
    });

    test('DELETE /api/v1/users/:userId without valid token', async () => {
        const response = await request(app)
            .delete('/api/v1/users/' + user.id)

        expect(response.statusCode).toBe(401);
    });

    test('DELETE /api/v1/users/:userId with the token of a different user', async () => {
        // Create valid token
        const payload = {
            id: '000000000000000000',
            email: 'nottest@mail.com',
            user_type: 'Consumer'
        }
        const options = { expiresIn: 86400 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app)
            .get('/api/v1/users/' + user.id) // id of the 'test' user
            .set('X-access-token', token)

        expect(response.statusCode).toBe(403);
    });

    test('DELETE /api/v1/users/:userId with valid token', async () => {
        // Create a test user
        const usertwo = new User({
            type: 'Consumer',
            email: 'test9@mail.com',
            username: 'test9',
            password: 'test9'
        });
        await usertwo.save();

        // Create valid token
        const payload = {
            id: usertwo.id,
            email: 'user9@mail.com',
            user_type: 'Consumer'
        }
        const options = { expiresIn: 86400 }
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        const response = await request(app)
            .delete('/api/v1/users/' + usertwo.id)
            .set('X-access-token', token)

        expect(response.statusCode).toBe(200);
        expect(await User.findById(payload.id).exec()).toBe(null);
    });
});
