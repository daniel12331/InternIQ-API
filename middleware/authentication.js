const User = require('../api/users/userModel')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.SECRET)
    // attach user or employer information to the request object
    if (payload.userId) {
      req.user = { userId: payload.userId, name: payload.name }
    } else if (payload.employerId) {
      req.employer = { employerId: payload.employerId, organisationname: payload.organisationname }
    }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
