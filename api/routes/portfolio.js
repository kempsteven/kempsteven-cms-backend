const express = require('express')
const router = express.Router()
const PortfolioController = require('../controllers/portfolio')

// middleware for accepting multiform/formdata and parsing and storing received image
const UploadImageHandler = require('../middleware/image-handler')
const UploadImg = new UploadImageHandler('portfolio')

// middleware for id validation (where if id exist in collection or format is invalid)
const Portfolio = require('../models/portfolio')
const IdValidation = require('../middleware/id-validation')
const IdValidator = new IdValidation(Portfolio)

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

// routes
router.get('/get-portfolio', PortfolioController.portfolio_get_all)

router.post(
	'/add-portfolio',
	tokenAuth,
	UploadImg.getUpload.fields([
		{ name: 'portfolioDesktopImg', maxCount: 1 },
		{ name: 'portfolioMobileImg', maxCount: 1 }
	]),
	PortfolioController.portfolio_add
)

router.patch(
	// path
	'/edit-portfolio/:id',
	// needed authentication to access route
	tokenAuth,
	// middleware for checking id is existing
	IdValidator.getIsIdValid,
	// middleware for accepting multiform/formdata with body(skillImg)
	UploadImg.getUpload.fields([
		{ name: 'portfolioDesktopImg', maxCount: 1 },
		{ name: 'portfolioMobileImg', maxCount: 1 }
	]),
	// function for editing skill
	PortfolioController.portfolio_edit
)

router.delete(
	'/delete-portfolio/:id',
	tokenAuth,
	IdValidator.getIsIdValid,
	PortfolioController.portfolio_delete
)

module.exports = router