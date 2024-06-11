const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


describe('POST /api/v1/authentication', () => {

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL + '/testdb');
        console.log('Database connected!');

        // Create a test user
        const user = new User({
            type: 'Consumer',
            email: 'test@mail.com',
            username: 'test',
            password: await bcrypt.hash('test', 10)
        });
        await user.save();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });

    test('POST /api/v1/authentication with valid user and valid password', async () => {
        const response = await request(app)
            .post('/api/v1/authentication')
            .send({
                username: 'test',
                password: 'test'
            })
        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('token');
        const decoded = jwt.decode(response.body.token);
        expect(decoded).toHaveProperty('email', 'test@mail.com');
    });

    test('POST /api/v1/authentication with non existent user', async () => {
        const response = await request(app)
            .post('/api/v1/authentication')
            .send({
                username: 'donotexist',
                password: 'test'
            })
        expect(response.statusCode).toBe(404);
    });

    test('POST /api/v1/authentication with empty password', async () => {
        const response = await request(app)
            .post('/api/v1/authentication')
            .send({
                username: 'test'
            })
        expect(response.statusCode).toBe(403);
    });
});

