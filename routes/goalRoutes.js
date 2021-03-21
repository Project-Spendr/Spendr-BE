const { Router } = require('express');
const Goal = require('../models/Goal');
const ensureAuth = require('../middleware/ensureAuth')

module.exports = Router()
  .post('/create', ensureAuth, (req, res, next) => {
    Goal
      .create({ ...req.body, user: req.user._id })
      .then(goal => res.send(goal))
      .catch(next)
  })
  .get('/', ensureAuth, (req, res, next) => {
    Goal
      .find({ user: req.user._id})
      .then(goal => res.send(goal))
      .catch(next)
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Goal
      .findByIdAndDelete(req.params.id)
      .then(goal => res.send(goal))
      .catch(next)
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    Goal
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(goal => res.send(goal))
      .catch(next);
  })