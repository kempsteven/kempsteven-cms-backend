const Portfolio = require('../models/portfolio')
const mongoose = require('mongoose')

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

	if (req.files) {
		req.body.portfolioDesktopImg = req.files.portfolioDesktopImg[0].path.replace(/\\/g, '/')
		req.body.portfolioMobileImg = req.files.portfolioMobileImg[0].path.replace(/\\/g, '/')
	}

	for(const property of Object.keys(req.body)) {
		propertyToUpdate[property] = req.body[property]
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
