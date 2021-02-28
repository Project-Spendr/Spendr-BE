require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../utils/connect');

const request = require('supertest');
const app = require('../utils/app');
const User = require('../models/User');


describe('user routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newUser;

  const agent = request.agent(app);

  beforeEach(async() => {
    newUser = await User.create({
      name: 'Coolio',
      email: 'coolio@gangstersparadise.com',
      password: 'swag'
    });

    return agent
      .post('/api/v1/Users/signup')
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
  })

  it('can signup a new user', async() => {

    return agent
      .post('/api/v1/Users/signup')
      .send({
        name: 'Coolio2',
        email: 'coolio@gangstersparadise.com',
        password: 'swag'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Coolio2',
          email: 'coolio@gangstersparadise.com',
          __v: 0
        });
      });
  });

  it('can verify if Coolio is logged in', async() => {

    newUser = await User.create({
      name: 'Coolio',
      email: 'coolio@gangstersparadise.com',
      password: 'swag'
    });

    return agent
      .post('/api/v1/Users/login')
      .send({
        email: 'coolio@gangstersparadise.com',
        password: 'swag'
      })
      .then(() => {
  
        return agent
          .get('/api/v1/Users/verify')
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.anything(),
              name: 'Coolio',
              email: 'coolio@gangstersparadise.com',
              __v: 0
            });
          });
      });
  });

  it('delete a user', () => {
    return User.create({
      name: 'Bing Bing Supreme',
      phone: '4066666666',
      email: 'sosupersourcreamy@sickness.sourcream',
      password: 'wordstuff',
      __v: 0
    })
      .then(user => agent
        .delete(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bing Bing Supreme',
          phone: '4066666666',
          email: 'sosupersourcreamy@sickness.sourcream',
          __v: 0
        });
      });
  });

  it('patches a user', () => {
    return User.create({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      password: 'wordstuff'
    })
      .then(user => {
        return agent
          .patch(`/api/v1/users/${user._id}`)
          .send({ name: 'Bing Bing Supreme', email: 'sosupersourcreamy@sickness.sourcream' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bing Bing Supreme',
          phone: '4066666666',
          email: 'sosupersourcreamy@sickness.sourcream',
          __v: 0
        });
      });
  });
});
