const Portfolio = require('../models/portfolio')
const mongoose = require('mongoose')
const fs = require('fs')

exports.portfolio_get_all = (req, res, next) => {
	Portfolio.find().select('-__v').exec()
		.then(result => {
			res.status(200).json({
				portfolioList: result
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
		portfolioDesktopImg: req.files.portfolioDesktopImg[0].path.replace(/\\/g, '/'),
		portfolioMobileImg: req.files.portfolioMobileImg[0].path.replace(/\\/g, '/'),
	})

	portfolio.save()
		.then(result => {
			Portfolio.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						portfolioList: result
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
	let oldImageFilePath = {
		portfolioDesktopImg: '',
		portfolioMobileImg: '',
	}

	if (req.files.portfolioDesktopImg) req.body.portfolioDesktopImg = req.files.portfolioDesktopImg[0].path.replace(/\\/g, '/')
	if (req.files.portfolioMobileImg) req.body.portfolioMobileImg = req.files.portfolioMobileImg[0].path.replace(/\\/g, '/')

	for(const property of Object.keys(req.body)) {
		propertyToUpdate[property] = req.body[property]
	}

	// only query and set oldfilepath if uploaded atleast 1 picture
	if (!!req.files.portfolioDesktopImg || !!req.files.portfolioMobileImg) {
		// getting the filepath so we could delete it after update
		Portfolio.findOne({_id}).select('portfolioDesktopImg portfolioMobileImg').exec()
			.then(doc => {
				/*
					used !! to turn the variable to boolean since its an array
				*/
				if (!!req.files.portfolioDesktopImg) {
					oldImageFilePath.portfolioDesktopImg = doc.portfolioDesktopImg
				}

				if (!!req.files.portfolioMobileImg) {
					oldImageFilePath.portfolioMobileImg = doc.portfolioMobileImg
				}
			})
			.catch(err => {
				res.status(500).json({
					error: err
				})
			})
	}

	//add validation if id is not available
	Portfolio.updateOne({_id}, {$set: propertyToUpdate})
		.exec()
		.then(doc => {
			Portfolio.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						portfolioList: result
					})
					if (oldImageFilePath.portfolioDesktopImg) {
						// file deletion after update
						if (fs.existsSync(oldImageFilePath.portfolioDesktopImg)) {
							fs.unlink(oldImageFilePath.portfolioDesktopImg, (error) => {
								if (error) {
									// throw error
									console.log(error)
								}

								oldImageFilePath.portfolioDesktopImg = ''
							})
						}
					}

					if (oldImageFilePath.portfolioMobileImg) {
						// file deletion after update
						if (fs.existsSync(oldImageFilePath.portfolioMobileImg)) {
							fs.unlink(oldImageFilePath.portfolioMobileImg, (error) => {
								if (error) {
									// throw error
									console.log(error)
								}

								oldImageFilePath.portfolioMobileImg = ''
							})
						}
					}
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

exports.portfolio_delete = (req, res, next) => {
	const _id = req.params.id

	//add validation if id is not available
	Portfolio.deleteOne({_id})
		.exec()
		.then(doc => {
			Portfolio.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						portfolioList: result
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
