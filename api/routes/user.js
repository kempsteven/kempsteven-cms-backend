const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')

// middleware for accepting multiform/formdata and parsing and storing received image
const FormDataHandler = require('../middleware/form-data-handler')
const FormDataClass = new FormDataHandler()

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

router.post(
	'/signup',
	FormDataClass.uploadNone,
	UserController.user_sign_up
)

router.post(
	'/login',
	FormDataClass.uploadNone,
	UserController.user_login_in
)

router.get('/token-auth', tokenAuth, UserController.user_refresh_token)

module.exports = router