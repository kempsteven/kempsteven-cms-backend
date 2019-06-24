const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')

// middleware for accepting multiform/formdata and parsing and storing received image
const UploadImageHandler = require('../middleware/form-data-handler')
const UploadImg = new UploadImageHandler()

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

router.post(
	'/signup',
	UploadImg.uploadNone,
	UserController.user_sign_up
)

router.post(
	'/login',
	UploadImg.uploadNone,
	UserController.user_login_in
)

router.get('/token-auth', tokenAuth, UserController.user_refresh_token)

module.exports = router