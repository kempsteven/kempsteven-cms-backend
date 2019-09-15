const Portfolio = require('../models/portfolio')
const cloudinary = require('cloudinary').v2

//cloudinary credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.portfolio_get_all = (req, res, next) => {
	Portfolio.find().select('-__v').exec()
		.then(result => {
			res.status(200).json({
				list: result
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.portfolio_add = (req, res, next) => {
	const portfolio = new Portfolio({
		portfolioTitle: req.body.portfolioTitle,
		portfolioDescription: req.body.portfolioDescription,
		portfolioTechnologies: req.body.portfolioTechnologies,
		portfolioUrl: req.body.portfolioUrl,
		portfolioDesktopImg: {
			publicId: req.body.imgFileObj[0].publicId,
			url: req.body.imgFileObj[0].url
		},

		// portfolioMobileImg: {
		// 	publicId: req.body.imgFileObj[1].publicId,
		// 	url: req.body.imgFileObj[1].url
		// },
	})

	if (req.body.imgFileObj[1]) {
		portfolio.portfolioMobileImg = {
			publicId: req.body.imgFileObj[1].publicId,
			url: req.body.imgFileObj[1].url
		}
	}

	portfolio.save()
		.then(result => {
			Portfolio.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						list: result
					})
				})
				.catch(err => {
					res.status(500).json({
						error: err
					})
				})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.portfolio_edit = (req, res, next) => {
	const _id = req.params.id
	const propertyToUpdate = {}
	const propertyNotToUpdate = [
		'oldPortfolioDesktopImgPublicId',
		'oldPortfolioMobileImgPublicId',
		'imgFileObj'
	]

	let imgPublicIdArr = []

	let newImgKeyArr = []


	// we would have to set front when uploading new image
	// front should require ImgPublicId to upload counterpart
	if (!!req.body.oldPortfolioDesktopImgPublicId) {
		imgPublicIdArr.push('oldPortfolioDesktopImgPublicId')
	}

	// If length is 1, it means that a desktop img has been uploaded
	if (req.body.imgFileObj.length === 1) {
		newImgKeyArr.push('portfolioDesktopImg')
	}

	if (!!req.body.oldPortfolioMobileImgPublicId) {
		imgPublicIdArr.push('oldPortfolioMobileImgPublicId')
	}

	// If length is 1, it means that a desktop and mobile img has been uploaded
	if (req.body.imgFileObj.length === 2) {
		newImgKeyArr.push('portfolioDesktopImg')
		newImgKeyArr.push('portfolioMobileImg')
	}

	// Setting request body of;
	// portfolioDesktopImg, portfolioMobileImg if they were included
	// In the form data
	newImgKeyArr.forEach((item, index) => {
		req.body[item] = {
			publicId: req.body.imgFileObj[index].publicId,
            url: req.body.imgFileObj[index].url
		}
	})

	let promiseDeletionArr = []

	imgPublicIdArr.forEach((item, index) => {
		promiseDeletionArr.push(
			new Promise((resolve, reject) => {
				cloudinary.uploader.destroy(
					req.body[item],
					(error, uploadResult) => {
						if (error) reject(error)
						else resolve(uploadResult)
					}
				)
			})
		)
	})

	// return res.status(200).json({
	// 	list: 'result'
	// })

	// this will run when Promise.all(promiseDeletionArr) is successful
	let updatePortfolioDocument = () => {
		// setting properties to update and remove property not needed
		let properties = Object.keys(req.body).filter(prop => propertyNotToUpdate.indexOf(prop) <= -1)
		for(const property of properties) {
			propertyToUpdate[property] = req.body[property]
		}

		Portfolio.updateOne({_id}, {$set: propertyToUpdate})
			.exec()
			.then(doc => {
				Portfolio.find().select('-__v').exec()
					.then(result => {
						res.status(200).json({
							list: result
						})
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({
							error: err
						})
					})
			})
			.catch(err => {
				res.status(500).json({
					error: err
				})
			})
	}

	Promise.all(promiseDeletionArr)
		.then(result =>  {
			updatePortfolioDocument()
		})	
		.catch(error => {
			return res.status(500).json({
				error: error
			})
		})
}

exports.portfolio_delete = (req, res, next) => {
	const _id = req.params.id

	if (!req.body.oldPortfolioDesktopImgPublicId) {
		return res.status(500).json({
			error: 'oldPortfolioDesktopImg and oldPortfolioMobileImg keys are required!'
		})
	}

	let imgPublicIdArrKeys = [
		'oldPortfolioDesktopImgPublicId',
		'oldPortfolioMobileImgPublicId'
	]

	if (!req.body.oldPortfolioMobileImgPublicId) {
		imgPublicIdArrKeys = ['oldPortfolioDesktopImgPublicId']
	}

	let promiseDeletionArr = []

	imgPublicIdArrKeys.forEach((item, index) => {
		promiseDeletionArr.push(
			new Promise((resolve, reject) => {
				cloudinary.uploader.destroy(
					req.body[item],
					(error, uploadResult) => {

					if (error) reject(error)
					else resolve(uploadResult)
				})
			})
		)
	})

	let deletePortfolioDocument = () => {
		Portfolio.deleteOne({_id})
			.exec()
			.then(doc => {
				Portfolio.find().select('-__v').exec()
					.then(result => {
						res.status(200).json({
							list: result
						})
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({
							error: err
						})
					})
			})
			.catch(err => {
				res.status(500).json({
					error: err
				})
			})
	}

	Promise.all(promiseDeletionArr)
		.then(result =>  {
			deletePortfolioDocument()
		})	
		.catch(error => {
			return res.status(500).json({
				error: error
			})
		})
}
