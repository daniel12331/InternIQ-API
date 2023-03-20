const express = require('express')
const router = express.Router()

const { fileupload, filedownload } = require('../api/fileupload/index')

router.post('/upload', fileupload)
router.get('/download/:id', filedownload)

module.exports = router