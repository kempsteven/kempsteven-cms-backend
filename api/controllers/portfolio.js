const Portfolio = require('../models/portfolio')
const mongoose = require('mongoose')
const fs = require('fs')

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
	let propertyNotToUpdate = ['oldPortfolioDesktopImg', 'oldPortfolioMobileImg']

	// check if uploaded file portfolioDesktopImg
	if (!!req.files.portfolioDesktopImg) {
		if (!req.body.oldPortfolioDesktopImg) {
			return res.status(500).json({
				error: 'oldPortfolioDesktopImg keys are required!'
			})
		}

		req.body.portfolioDesktopImg = req.files.portfolioDesktopImg[0].path.replace(/\\/g, '/')
	}

	// check if uploaded file portfolioMobileImg	
	if (!!req.files.portfolioMobileImg) {
		if (!req.body.oldPortfolioMobileImg) {
			return res.status(500).json({
				error: 'oldPortfolioDesktopImg keys are required!'
			})
		}

		req.body.portfolioMobileImg = req.files.portfolioMobileImg[0].path.replace(/\\/g, '/')
	}

	// setting properties to update and remove property not needed
	let properties = Object.keys(req.body).filter(prop => propertyNotToUpdate.indexOf(prop) <= -1)
	for(const property of properties) {
		propertyToUpdate[property] = req.body[property]
	}

	// check if old path exist and remove it
	if (req.body.oldPortfolioDesktopImg && !!req.files.portfolioDesktopImg) {
		if (fs.existsSync(req.body.oldPortfolioDesktopImg)) {
			fs.unlink(req.body.oldPortfolioDesktopImg, (error) => {
				if (error) console.log(error)
			})
		}
	}

	// check if old path exist and remove it
	if (req.body.oldPortfolioMobileImg && !!req.files.portfolioMobileImg) {
		if (fs.existsSync(req.body.oldPortfolioMobileImg)) {
			fs.unlink(req.body.oldPortfolioMobileImg, (error) => {
				if (error) console.log(error)
			})
		}
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

exports.portfolio_delete = (req, res, next) => {
	const _id = req.params.id

	if (!req.body.oldPortfolioDesktopImg || !req.body.oldPortfolioMobileImg) {
		return res.status(500).json({
			error: 'oldPortfolioDesktopImg and oldPortfolioMobileImg keys are required!'
		})
	}

	// check if old path exist and remove it
	if (req.body.oldPortfolioDesktopImg) {
		if (fs.existsSync(req.body.oldPortfolioDesktopImg)) {
			fs.unlink(req.body.oldPortfolioDesktopImg, (error) => {
				if (error) console.log(error)
			})
		}
	}

	// check if old path exist and remove it
	if (req.body.oldPortfolioMobileImg) {
		if (fs.existsSync(req.body.oldPortfolioMobileImg)) {
			fs.unlink(req.body.oldPortfolioMobileImg, (error) => {
				if (error) console.log(error)
			})
		}
	}

	//add validation if id is not available
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
