const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const EmployerSchema = new mongoose.Schema({
  organisationname: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  organisationemail: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
})

EmployerSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

EmployerSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, organisationname: this.organisationname },
    process.env.SECRET,
   
  )
}

EmployerSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('Employer', EmployerSchema)