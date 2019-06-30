const express = require('express')
const router = express.Router()
const EmailController = require('../controllers/email')

const FormDataHandler = require('../middleware/form-data-handler')
const FormDataClass = new FormDataHandler()

router.post(
    '/send',
    FormDataClass.uploadNone,
    EmailController.send_email
)

module.exports = router