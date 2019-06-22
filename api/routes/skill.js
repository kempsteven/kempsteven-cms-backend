const express = require('express')
const router = express.Router()
const SkillController = require('../controllers/skill')

// middleware for accepting multiform/formdata and parsing and storing received image
const FormDataHandler = require('../middleware/form-data-handler')
const FormDataClass = new FormDataHandler('skillImg')

// middleware for id validation (where if id exist in collection or format is invalid)
const Skill = require('../models/skill')
const IdValidation = require('../middleware/id-validation')
const IdValidator = new IdValidation(Skill)

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

const setUploadPath = (req, res, next) => {
	res.locals.uploadPath = 'skill';
	next()
}

// routes
router.get('/get-skills', SkillController.skill_get_all)

router.post(
	'/add-skills',
	tokenAuth,
	setUploadPath,
	FormDataClass.multerUploadSingle,
	FormDataClass.cloudinaryUpload,
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
	// UploadImg.getUpload.single('skillImg'),
	// function for editing skill
	SkillController.skill_edit
)

router.delete(
	'/delete-skills/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	FormDataClass.uploadNone,
	SkillController.skill_delete
)

module.exports = router