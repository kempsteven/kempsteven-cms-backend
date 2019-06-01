const Skill = require('../models/skill')
const mongoose = require('mongoose')

//check if id is valid
exports.isIdValid = (req, res, next) => {
	let _id = req.params.id

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).json({
			message: 'No valid entry found for provided ID'
		})
	}

	Skill.findById({ _id }).lean()
		.exec()
		.then(doc => {
			if (!doc) {
				return res.status(404).json({
					message: 'No valid entry found for provided ID'
				})
			}

			next()
		})
		.catch(err => {
			return res.status(500).json({
				error: err
			})
		})
}

exports.skill_get_all = (req, res, next) => {
	Skill.find().select('-__v').exec()
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
}

exports.skill_add = (req, res, next) => {
	const skill = new Skill({
		skillName: req.body.skillName,
		skillLevel: req.body.skillLevel,
		skillImg: req.file.path.replace(/\\/g, '/')
	})

	skill.save()
		.then(result => {
			Skill.find().select('-__v').exec()
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
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.skill_edit = (req, res, next) => {
	const _id = req.params.id
	const propertyToUpdate = {}

	if (req.file) {
		req.body.skillImg = req.file.path.replace(/\\/g, '/')
	}

	for(const property of Object.keys(req.body)) {
		propertyToUpdate[property] = req.body[property]
	}

	//add validation if id is not available
	Skill.updateOne({_id}, {$set: propertyToUpdate})
		.exec()
		.then(doc => {
			Skill.find().select('-__v').exec()
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

exports.skill_delete = (req, res, next) => {
	const _id = req.params.id

	//add validation if id is not available
	Skill.deleteOne({_id})
		.exec()
		.then(doc => {
			Skill.find().select('-__v').exec()
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
