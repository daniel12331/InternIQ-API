const express = require('express')
const router = express.Router()
const { login, registerapplication } = require('../api/applications/index')

router.post('/registerapplication', registerapplication)
router.post('/login', login)

module.exports = router