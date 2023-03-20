const express = require('express')

const router = express.Router()
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  updateTotalApplicants
} = require('../api/jobs/index')

router.route('/').post(createJob).get(getAllJobs)

router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

router.route('/totalApplicants/:id').patch(updateTotalApplicants)
module.exports = router