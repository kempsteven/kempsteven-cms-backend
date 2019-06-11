const Skill = require('../models/skill')
const mongoose = require('mongoose')
const fs = require('fs')

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
	let oldImageFilePath = ''

	if (req.file) {
		req.body.skillImg = req.file.path.replace(/\\/g, '/')
	}

	for(const property of Object.keys(req.body)) {
		propertyToUpdate[property] = req.body[property]
	}

	if (req.body.skillImg) {
		// getting the filepath so we could delete it after update
		Skill.findOne({_id}).select('skillImg').exec()
			.then(doc => {
				oldImageFilePath = doc.skillImg
			})
			.catch(err => {
				res.status(500).json({
					error: err
				})
			})
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

					if (oldImageFilePath) {
						// file deletion after update
						if (fs.existsSync(oldImageFilePath)) {
							fs.unlink(oldImageFilePath, (error) => {
								if (error) {
									// throw error
									console.log(error)
								}

								oldImageFilePath = ''
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

exports.skill_delete = (req, res, next) => {
	const _id = req.params.id
	let oldImageFilePath = ''
	
	// getting the filepath so we could delete it after update
	Skill.findOne({_id}).select('skillImg').exec()
		.then(doc => {
			oldImageFilePath = doc.skillImg
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		})

	//add validation if id is not available
	Skill.deleteOne({_id})
		.exec()
		.then(doc => {
			Skill.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						skillList: result
					})

					if (oldImageFilePath) {
						// file deletion after update
						if (fs.existsSync(oldImageFilePath)) {
							fs.unlink(oldImageFilePath, (error) => {
								if (error) {
									// throw error
									console.log(error)
								}

								oldImageFilePath = ''
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
