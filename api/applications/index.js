const Application = require('../applications/applicationModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')

const registerapplication = async (req, res) => {
  //console.log(req.body)
  req.body.createdBy = req.user.userId
  const application = await Application.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ application: { name: application.name , appID : application._id }});
  
}
const getAllAppliedJobs = async (req, res) => {
  const appliedjobs = await Application.find({createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ appliedjobs, count: appliedjobs.length })
}

const deleteApplication = async (req, res) => {
  const {
    user: { userId },
    params: { id: _id },
  } = req

  const application = await Application.findByIdAndRemove({
    _id: _id,
    createdBy: userId,
  })
  if (!application) {
    throw new NotFoundError(`No application with id ${_id}`)
  }
  res.status(StatusCodes.OK).send()
}

const getApplicationsByID = async (req, res) => {
  const {
    params: { id: jobId },
  } = req

  const appliedjobs = await Application.find({
    jobID : jobId,
  })

  if (!appliedjobs) {
    throw new NotFoundError(`No applications ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ appliedjobs, count: appliedjobs.length })
}


const updateApplication = async (req, res) => {
  console.log(req.body)
  const {
    body: { status, feedback},
    params: { id: _id },
  } = req


  if (status === ''  || feedback === '') {
    throw new BadRequestError('status cannot be empty')
  }
  const application = await Application.findByIdAndUpdate(
    { _id: _id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!application) {
    throw new NotFoundError(`No application with id ${_id}`)
  }
  res.status(StatusCodes.OK).json({ application })
}

const getStats = async (req, res) => {
  const appliedjobs = await Application.find({createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ appliedjobs, count: appliedjobs.length })
}

module.exports = {
  registerapplication,
  updateApplication,
  getAllAppliedJobs,
  deleteApplication,
  getApplicationsByID,
  getStats
}