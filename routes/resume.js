const express = require('express')
const router = express.Router()

const { createResume } = require('../api/resume/index')
router.post('/createresume', createResume)


module.exports = router