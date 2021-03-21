require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../utils/connect');

const request = require('supertest');
const app = require('../utils/app');
const Goal = require('../models/Goal');
const User = require('../models/User');

describe('Goal routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  const agent = request.agent(app);

  beforeEach(async() => {
    newUser = await User.create({
        name: 'Bing Bing',
        phone: '4066666666',
        email: 'sosuperrad@sickness.gov',
        password: 'somewords'
    });

    return agent
      .post('/api/v1/Users/login')
      .send({
        name: 'Bing Bing',
        phone: '4066666666',
        email: 'sosuperrad@sickness.gov',
        password: 'somewords'
      });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('can create a goal using POST', async() => {
    return agent
      .post('/api/v1/Goal/create')
      .send({
        user: newUser._id,
        title: "Save 100 dollars",
        currentAmount: 0,
        goalAmount: 100,
        completed: false,
        transactions: [],
        dateCreated: Date()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: newUser.id,
          title: "Save 100 dollars",
          currentAmount: 0,
          goalAmount: 100,
          completed: false,
          transactions: [],
          dateCreated: expect.anything(),
          __v: 0
        })
      })
    });

    it('patches a goal using PATCH', () => {
      return Goal.create({
          user: newUser._id,
          title: "Save 100 dollars",
          currentAmount: 0,
          goalAmount: 100,
          completed: false,
          transactions: [],
          dateCreated: Date()
      })
        .then(goal => {
          return agent
            .patch(`/api/v1/Goal/${goal._id}`)
            .send({ currentAmount: 50, transactions: [20, 30] });
        })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.anything(),
            user: newUser.id,
            title: "Save 100 dollars",
            currentAmount: 50,
            goalAmount: 100,
            completed: false,
            transactions: [20, 30],
            dateCreated: expect.anything(),
            __v: 0
          });
        });
  });

  it('can delete a goal using DELETE', async() => {

    return Goal.create({
        user: newUser._id,
        title: "Save 100 dollars",
        currentAmount: 0,
        goalAmount: 100,
        completed: false,
        transactions: [],
        dateCreated: Date()
    })
      .then(goal => agent
      .delete(`/api/v1/Goal/${goal._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: newUser.id,
          title: "Save 100 dollars",
          currentAmount: 0,
          goalAmount: 100,
          completed: false,
          transactions: [],
          dateCreated: expect.anything(),
          __v: 0
        })
      })
  )});

});