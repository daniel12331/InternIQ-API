const express = require('express')
const router = express.Router()
const { register, login, updateUser } = require('../api/users/index')

router.post('/register', register)
router.post('/login', login)
router.patch('/updateUser', updateUser)
module.exports = router