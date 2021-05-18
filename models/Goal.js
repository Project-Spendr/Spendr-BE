const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  goalAmount: {
    type: Number,
    required: true
  },

  currentAmount: {
    type: Number,
    required: true
  },

  transactions: [Number],

  completed: {
    type: Boolean,
    required: true
  },

  dateCreated: {
    type: Date,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

goalSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'Goal'
});

module.exports = mongoose.model('Goal', goalSchema);