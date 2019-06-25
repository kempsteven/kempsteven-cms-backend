const express = require('express')
const router = express.Router()
const SkillController = require('../controllers/skill')

// middleware for accepting multiform/formdata and parsing and storing received image
const FormDataHandler = require('../middleware/form-data-handler')

// skillImg key needed for multer to get the img uploaded
// skill is the folder that the img will be uploaded in cloudinary
const FormDataClass = new FormDataHandler('skillImg', 'skill')

// middleware for id validation (where if id exist in collection or format is invalid)
const Skill = require('../models/skill')
const IdValidation = require('../middleware/id-validation')
const IdValidator = new IdValidation(Skill)

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

// validate if a key missing
const isFormComplete = (req, res, next) => {
	if (!req.body.oldSkillImgPublicId) {
		return res.status(500).json({
			error: 'oldSkillImgPublicId key is required!'
		})
	}

	next()
}

const test = (req, res, next) => {
	console.log('testrdasd')
	return res.json({
		message: 'fuckingngnggn heroku why aqre uj not working'
	})
}

/*
	'/add-skills' -> route,
	tokenAuth -> token authentication,
	IdValidator.getIsIdValid -> middleware for checking id is existing or valid
	FormDataClass.multerUploadSingle -> middleware for accepting multiform/formdata with body(skillImg)
	isFormComplete -> middleware to check if a key is missing before uploading
	FormDataClass.cloudinaryUploader -> middleware for uploading to cloudinary
	SkillController.skill_edit -> function for editing skill documents
*/

// routes
router.get('/get-skills', SkillController.skill_get_all)

router.post(
	'/add-skills',
	tokenAuth,
	FormDataClass.multerUploadSingle,
	FormDataClass.cloudinaryUploader,
	SkillController.skill_add,
)

router.patch(
	'/edit-skills/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	FormDataClass.multerUploadSingle,
	isFormComplete,
	FormDataClass.cloudinaryUploader,
	SkillController.skill_edit
)

router.delete(
	'/delete-skills/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	FormDataClass.uploadNone,
	isFormComplete,
	SkillController.skill_delete
)

module.exports = router