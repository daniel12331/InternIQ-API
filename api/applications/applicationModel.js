const mongoose = require('mongoose')


const ApplicationSchema = new mongoose.Schema({
  jobID: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please try again later...'],
    maxlength: 50,
    minlength: 3,
  },
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
})


module.exports = mongoose.model('Application', ApplicationSchema)