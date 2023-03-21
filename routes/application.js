const express = require('express')
const router = express.Router()
const { registerapplication, getAllAppliedJobs, deleteApplication, updateApplication,getApplicationsByID } = require('../api/applications/index')

router.post('/registerapplication', registerapplication)
router.route('/').get(getAllAppliedJobs)

router.route('/:id').delete(deleteApplication).patch(updateApplication).get(getApplicationsByID)


module.exports = router