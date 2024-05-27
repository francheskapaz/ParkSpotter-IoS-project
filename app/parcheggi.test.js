const request = require('supertest');
const app = require('./app.js'); 
const Parking = require('./models/parking.js');

describe('Parking API', () => {
  let parkingSpy;
  let parkingSpyFindById;
  let parkingSpyCreate;
  let parkingSpyUpdate;
  let parkingSpyDelete;

  beforeAll(() => {
    parkingSpy = jest.spyOn(Parking, 'find').mockImplementation(() => {
      return [
        {
          _id: '60c72b1f9b1d8b0022a4e9b5',
          name: 'Test Parking',
          fee: 5,
          maxStop: 2,
          open: true,
          coordinates: { nord: 45.0, est: 9.0 },
          nParkingSpaces: 50,
          vehicleType: 'Car',
          nFree: 10,
          reservations: [],
        },
      ];
    });

    parkingSpyFindById = jest.spyOn(Parking, 'findById').mockImplementation((id) => {
      if (id === '60c72b1f9b1d8b0022a4e9b5') {
        return {
          _id: '60c72b1f9b1d8b0022a4e9b5',
          name: 'Test Parking',
          fee: 5,
          maxStop: 2,
          open: true,
          coordinates: { nord: 45.0, est: 9.0 },
          nParkingSpaces: 50,
          vehicleType: 'Car',
          nFree: 10,
          reservations: [],
        };
      } else {
        return null;
      }
    });

    parkingSpyCreate = jest.spyOn(Parking, 'create').mockImplementation((data) => {
      return Promise.resolve({
        _id: '60c72b1f9b1d8b0022a4e9b6',
        ...data,
      });
    });

    parkingSpyUpdate = jest.spyOn(Parking, 'findByIdAndUpdate').mockImplementation((id, data) => {
      return {
        _id: id,
        ...data,
      };
    });

    parkingSpyDelete = jest.spyOn(Parking, 'findByIdAndDelete').mockImplementation((id) => {
      if (id === '60c72b1f9b1d8b0022a4e9b5') {
        return {
          _id: '60c72b1f9b1d8b0022a4e9b5',
        };
      } else {
        return null;
      }
    });
  });

  afterAll(() => {
    parkingSpy.mockRestore();
    parkingSpyFindById.mockRestore();
    parkingSpyCreate.mockRestore();
    parkingSpyUpdate.mockRestore();
    parkingSpyDelete.mockRestore();
  });

  test('GET /api/v1/parkings should respond with an array of parkings', async () => {
    const response = await request(app).get('/api/v1/parkings').expect('Content-Type', /json/).expect(200);
    expect(response.body).toEqual([
      {
        _id: '60c72b1f9b1d8b0022a4e9b5',
        name: 'Test Parking',
        fee: 5,
        maxStop: 2,
        open: true,
        coordinates: { nord: 45.0, est: 9.0 },
        nParkingSpaces: 50,
        vehicleType: 'Car',
        nFree: 10,
        reservations: [],
      },
    ]);
  });

  test('GET /api/v1/parkings/:id should respond with a single parking', async () => {
    const response = await request(app)
      .get('/api/v1/parkings/60c72b1f9b1d8b0022a4e9b5')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toEqual({
      _id: '60c72b1f9b1d8b0022a4e9b5',
      name: 'Test Parking',
      fee: 5,
      maxStop: 2,
      open: true,
      coordinates: { nord: 45.0, est: 9.0 },
      nParkingSpaces: 50,
      vehicleType: 'Car',
      nFree: 10,
      reservations: [],
    });
  });

  test('POST /api/v1/parkings should create a new parking', async () => {
    const newParking = {
      name: "New Parking",
      fee: 10,
      maxStop: 3,
      open: false,
      coordinates: { nord: 40.0, est: 8.0 },
      nParkingSpaces: 30,
      vehicleType: "Bike",
      nFree: 5,
      reservations: [],
    };
    const response = await request(app).post('/api/v1/parkings').send(newParking).expect('Content-Type', /json/).expect(201);
    expect(response.body).toMatchObject(newParking);
  }, 50000);

  test('PATCH /api/v1/parkings/:id should update an existing parking', async () => {
    const updatedParking = {
      name: 'Updated Parking',
      fee: 8,
      maxStop: 4,
      open: true,
      coordinates: { nord: 41.0, est: 7.0 },
      nParkingSpaces: 40,
      vehicleType: 'Truck',
      nFree: 15,
      reservations: [],
    };
    const response = await request(app).patch('/api/v1/parkings/60c72b1f9b1d8b0022a4e9b5').send(updatedParking).expect('Content-Type', /json/).expect(200);
    expect(response.body).toEqual({
      _id: '60c72b1f9b1d8b0022a4e9b5',
      name: 'Updated Parking',
      fee: 8,
      maxStop: 4,
      open: true,
      coordinates: { nord: 41.0, est: 7.0 },
      nParkingSpaces: 40,
      vehicleType: 'Truck',
      nFree: 15,
      reservations: [],
    });
  });

  test('DELETE /api/v1/parkings/:id should delete an existing parking', async () => {
    const response = await request(app).delete('/api/v1/parkings/60c72b1f9b1d8b0022a4e9b5').expect('Content-Type', /json/).expect(200);
    expect(response.body).toEqual({
      message: 'Parcheggio deleted',
    });
  });
  
  
});
