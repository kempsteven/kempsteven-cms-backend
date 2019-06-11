const express = require('express')
const router = express.Router()
const EducationController = require('../controllers/education')

// middleware for id validation (where if id exist in collection or format is invalid)
const Education = require('../models/education')
const IdValidation = require('../middleware/id-validation')
const IdValidator = new IdValidation(Education)

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

// routes
router.get('/get-education', EducationController.education_get_all)

router.post(
	'/add-education',
	tokenAuth,
	EducationController.education_add
)

router.patch(
	// path
	'/edit-education/:id',
	// needed authentication to access route
	tokenAuth,
	// middleware for checking id is existing
	IdValidator.getIsIdValid,
	// function for editing skill
	EducationController.education_edit
)

router.delete(
	'/delete-education/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	EducationController.education_delete
)

module.exports = router