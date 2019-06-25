const express = require('express')
const router = express.Router()
const PortfolioController = require('../controllers/portfolio')

// middleware for accepting multiform/formdata and parsing and storing received image
const FormDataHandler = require('../middleware/form-data-handler')

// skillImg key needed for multer to get the img uploaded
// skill is the folder that the img will be uploaded in cloudinary
const FormDataClass = new FormDataHandler(['portfolioDesktopImg', 'portfolioMobileImg'], 'portfolio')

// middleware for id validation (where if id exist in collection or format is invalid)
const Portfolio = require('../models/portfolio')
const IdValidation = require('../middleware/id-validation')
const IdValidator = new IdValidation(Portfolio)

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

/*
	// path
	'/edit-portfolio/:id',
	// needed authentication to access route
	tokenAuth,
	// middleware for checking id is existing
	IdValidator.getIsIdValid,
	// middleware for accepting multiform/formdata with body(skillImg)
	FormDataClass.multerUploadFields,
	// middleware for uploading to cloudinary
	FormDataClass.cloudinaryMultipleUpload,
	// function for editing skill
	PortfolioController.portfolio_edit
)
*/

// routes
router.get('/get-portfolio', PortfolioController.portfolio_get_all)

router.post(
	'/add-portfolio',
	tokenAuth,
	FormDataClass.multerUploadFields,
	FormDataClass.cloudinaryMultipleUpload,
	PortfolioController.portfolio_add
)

router.patch(
	'/edit-portfolio/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	FormDataClass.multerUploadFields,
	FormDataClass.cloudinaryMultipleUpload,
	PortfolioController.portfolio_edit
)

router.delete(
	'/delete-portfolio/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	FormDataClass.uploadNone,
	PortfolioController.portfolio_delete
)

module.exports = router