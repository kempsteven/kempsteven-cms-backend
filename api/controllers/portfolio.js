const Portfolio = require('../models/portfolio')
const cloudinary = require('cloudinary').v2

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

		portfolioMobileImg: {
			publicId: req.body.imgFileObj[1].publicId,
			url: req.body.imgFileObj[1].url
		},
	})

	portfolio.save()
		.then(result => {
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
		newImgKeyArr.push('portfolioDesktopImg')
	}

	if (!!req.body.oldPortfolioMobileImgPublicId) {
		imgPublicIdArr.push('oldPortfolioMobileImgPublicId')
		newImgKeyArr.push('portfolioMobileImg')
	}

	let promiseDeletionArr = []

	imgPublicIdArr.forEach((item, index) => {
		req.body[newImgKeyArr[index]] = {
			publicId: req.body.imgFileObj[index].publicId,
            url: req.body.imgFileObj[index].url
		}

		promiseDeletionArr.push(
			new Promise((resolve, reject) => {
				cloudinary.uploader.destroy(
					req.body[imgPublicIdArr[index]],
					(error, uploadResult) => {

					if (error) reject(error)
					else resolve(uploadResult)
				})
			})
		)
	})

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

	if (!req.body.oldPortfolioDesktopImgPublicId || !req.body.oldPortfolioMobileImgPublicId) {
		return res.status(500).json({
			error: 'oldPortfolioDesktopImg and oldPortfolioMobileImg keys are required!'
		})
	}

	let imgPublicIdArrKeys = [
		'oldPortfolioDesktopImgPublicId',
		'oldPortfolioMobileImgPublicId'
	]

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
