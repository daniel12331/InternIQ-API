const express = require('express')
const router = express.Router()
const { registerapplication, 
    getAllAppliedJobs, 
    deleteApplication, 
    updateApplication,
    getApplicationsByID,
    getStats} = require('../api/applications/index')

router.post('/registerapplication', registerapplication)
router.route('/').get(getAllAppliedJobs)

router.route('/:id').delete(deleteApplication).patch(updateApplication).get(getApplicationsByID)

router.route('/stats').get(getStats)


module.exports = router