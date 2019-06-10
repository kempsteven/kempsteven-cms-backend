const Education = require('../models/education')
const mongoose = require('mongoose')

exports.education_get_all = (req, res, next) => {
	Education.find().select('-__v').exec()
		.then(result => {
			res.status(200).json({
				educationList: result
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.education_add = (req, res, next) => {
	const education = new Education({
		education: req.body.education,
		awards: req.body.awards
	})

	education.save()
		.then(result => {
			Education.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						education: result
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

exports.education_edit = (req, res, next) => {
	const _id = req.params.id
	const propertyToUpdate = {}

	if (req.file) {
		req.body.skillImg = req.file.path.replace(/\\/g, '/')
	}

	for(const property of Object.keys(req.body)) {
		propertyToUpdate[property] = req.body[property]
	}

	//add validation if id is not available
	Education.updateOne({_id}, {$set: propertyToUpdate})
		.exec()
		.then(doc => {
			Education.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						skillList: result
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

exports.education_delete = (req, res, next) => {
	const _id = req.params.id

	//add validation if id is not available
	Education.deleteOne({_id})
		.exec()
		.then(doc => {
			Education.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						skillList: result
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
