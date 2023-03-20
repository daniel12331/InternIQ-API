const mongoose = require('mongoose')


const ApplicationSchema = new mongoose.Schema({
  jobID: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please try again later...'],
    maxlength: 50,
    minlength: 3,
  },
  JobTitle: {
    type: String,
    required: [true, 'Please try again later.s..'],
    maxlength: 50,
    minlength: 1,
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
  feedback: {
    type: String,
    maxlength: 450,
    minlength: 3,
  },
  status: {
    type: String,
    enum: ['pending', 'declined', 'interview'],
    default: 'pending',
  },
  

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  
},
{ timestamps: true }
)


module.exports = mongoose.model('Application', ApplicationSchema)