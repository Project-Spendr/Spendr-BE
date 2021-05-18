const User = require('../models/User');
const chance = require('chance').Chance();

module.exports = async({ users = 40 } = {}) => {
    
    User.create([...Array(users)].map(() => ({ 
    name: chance.name(),
    email: 'email@email.com',
    passwordHash: 'password'
  })));
};