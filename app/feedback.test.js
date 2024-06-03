const request = require('supertest');
const app = require('./app.js');
const mongoose = require('mongoose');
const Feedback = require('./models/feedback.js');
DB_URL = 'mongodb+srv://mongoadmin:OTPk5CLSW4fJfeY3@cluster0.twbxma1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
require('dotenv').config();

describe('GET /api/v2/feedback/:id', () => {    
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
        await Feedback.deleteMany({});
    });

    test('GET /api/v2/feedback/:id with valid id', async () => {
        const initialFeedback = new Feedback({
            user_id: new mongoose.Types.ObjectId(),
            parking_id: new mongoose.Types.ObjectId(),
            score: 4,
            comment: 'Good parking!'
        });
        await initialFeedback.save();

        const response = await request(app)
            .get(`/api/v2/feedback/${initialFeedback._id}`);
        console.log(response.body);

        expect(response.statusCode).toBe(200);
    });

});



describe('POST /api/v2/feedback', () => {
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
            await Feedback.deleteMany({});
        });

        test('POST /api/v2/feedback with valid data', async () => {
            const validUserId = new mongoose.Types.ObjectId();
            const validParkingId = new mongoose.Types.ObjectId();
            const response = await request(app)

                .post('/api/v2/feedback')
                .send({
                    user_id: validUserId,  
                    parking_id: validParkingId,
                    score: 4,
                    comment: 'Great parking!'
                });
            console.log(response.body);
    
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Feedback created successfully');
        });
    
});

describe('PATCH /api/v2/feedback/:id', () => {
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
            await Feedback.deleteMany({});
        });

        test('PATCH /api/v2/feedback/:id with valid data', async () => {
            const initialFeedback = new Feedback({
                user_id: new mongoose.Types.ObjectId(),
                parking_id: new mongoose.Types.ObjectId(),
                score: 1,
                comment: 'Poor parking'
            });
            await initialFeedback.save();

            const updatedFeedbackData = {
                score: 3,
                comment: 'Could be worst'
            };

            const response = await request(app)
                .patch(`/api/v2/feedback/${initialFeedback._id}`)
                .send(updatedFeedbackData);
            
            console.log(response.body);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Feedback updated successfully');
            expect(response.body.feedback.score).toBe(updatedFeedbackData.score);
            expect(response.body.feedback.comment).toBe(updatedFeedbackData.comment);
        });

});

describe('DELETE /api/v2/feedback/:id', () => {
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
        await Feedback.deleteMany({});
    });
    test('DELETE /api/v2/feedback/:id with valid id', async () => {
        const initialFeedback = new Feedback({
            user_id: new mongoose.Types.ObjectId(),
            parking_id: new mongoose.Types.ObjectId(),
            score: 4,
            comment: 'Good parking!'
        });
        await initialFeedback.save();
        const response = await request(app)
            .delete(`/api/v2/feedback/${initialFeedback._id}`);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Feedback deleted successfully');
    });
});
