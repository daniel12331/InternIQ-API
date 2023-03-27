const Job = require('../jobs/jobModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../../errors')



const getAllJobs = async (req, res) => {
  const searchQuery = req.query.search;
  const jobType = req.query.JobType;
  
  let criteria = {};
  if (searchQuery) {
    criteria.position = searchQuery;
  }
  if (jobType) {
    criteria.JobType = jobType;
  }
  
  const jobs = await Job.find(criteria).sort('createdAt');
  
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}
const getJob = async (req, res) => {
  const {
    params: { id: jobId },
  } = req

  const job = await Job.findOne({
    _id: jobId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.employer.employerId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req


  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const updateTotalApplicants = async (req, res) => {
  const {
    body: { totalApplicants },
    params: { id: jobId },
  } = req


  if (totalApplicants === '') {
    throw new BadRequestError('Error')
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const {
    employer: { employerId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: employerId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  updateTotalApplicants
}