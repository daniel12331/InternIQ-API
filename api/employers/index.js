const Employer = require('../employers/employerModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')

const register = async (req, res) => {
  console.log(req.body)
  const employer = await Employer.create({ ...req.body })
  const token = employer.createJWT()
  res.status(StatusCodes.CREATED).json({ employer: { organisationname: employer.organisationname }, token })
}

const login = async (req, res) => {
  const { organisationemail, password } = req.body

  if (!organisationemail || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const employer = await Employer.findOne({ organisationemail })
  if (!employer) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await employer.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = employer.createJWT()
  res.status(StatusCodes.OK).json({ employer: { organisationname: employer.organisationname, organisationemail: employer.organisationemail, token: token} })
}

module.exports = {
  register,
  login,
}