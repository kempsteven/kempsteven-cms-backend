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
	// path
	'/edit-skills/:id',
	// authentication needed to access route
	tokenAuth,
	// middleware for checking id is existing
	IdValidator.getIsIdValid,
	// middleware for accepting multiform/formdata with body(skillImg)
	FormDataClass.multerUploadSingle,
	// middleware to check if a key is missing before uploading
	isFormComplete,
	// middleware for uploading to cloudinary
	FormDataClass.cloudinaryUploader,
	// function for editing skill
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