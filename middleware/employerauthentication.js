const User = require('../api/users/userModel')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
 // console.log(req.headers);
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]


  try {
    const payload = jwt.verify(token, process.env.SECRET)
    //console.log(payload)
    // attach the user to the job routes
    req.employer = { employerId: payload.employerId, organisationname: payload.organisationname }
    
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth