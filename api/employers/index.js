const Employer = require('../employers/employerModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')

const register = async (req, res) => {
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
  //console.log(token)
  res.status(StatusCodes.OK).json({ employer: { organisationname: employer.organisationname, organisationemail: employer.organisationemail, token: token} })
}

const updateUser = async (req, res) => {
  const {
    employer: { employerId },
    body
  } = req

  const employer = await Employer.findByIdAndUpdate(
    { _id: employerId},
    req.body,
    { new: true, runValidators: true }
  )

  if (!employer) {
    throw new NotFoundError(`No user with id ${employerId}`)
  }
  res.status(StatusCodes.OK).json({ employer })
}
module.exports = {
  register,
  login,
  updateUser
}