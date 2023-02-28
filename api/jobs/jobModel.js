const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    jobLocation: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    totalApplicants: {
      type: Number ,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],

    },
    jobType: {
      type: String,
      enum: ['In-Office', 'Remote', 'Hybrid'],
      default: 'In-Office',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', JobSchema)