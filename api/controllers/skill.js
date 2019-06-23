const Skill = require('../models/skill')
const mongoose = require('mongoose')

const cloudinary = require('cloudinary').v2

exports.skill_get_all = (req, res, next) => {
	Skill.find().select('-__v').exec()
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

exports.skill_add = (req, res, next) => {
	const skill = new Skill({
		skillName: req.body.skillName,
		skillLevel: req.body.skillLevel,
		skillImg: req.body.imgFileObj
	})

	skill.save()
		.then(result => {
			Skill.find().select('-__v').exec()
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
 
exports.skill_edit = (req, res, next) => {
	const _id = req.params.id
	const propertyToUpdate = {}

	if (!!req.body.imgFileObj) {
		req.body.skillImg = req.body.imgFileObj
	}

	// setting properties to update and remove property not needed
	let properties = Object.keys(req.body).filter(prop => prop !== 'oldSkillImgPublicId')
	for(const property of properties) {
		propertyToUpdate[property] = req.body[property]
	}

	//add validation if id is not available
	Skill.updateOne({_id}, {$set: propertyToUpdate})
		.exec()
		.then(doc => {
			Skill.find().select('-__v').exec()
				.then(result => {
					cloudinary.uploader.destroy(
						req.body.oldSkillImgPublicId,
						(error, uploadResult) => {

						if (error) {
							return res.status(500).json({
								error: error
							})
						}

						res.status(200).json({
							list: result
						})
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
	let oldImageFilePath = ''

	//add validation if id is not available
	Skill.deleteOne({_id})
		.exec()
		.then(doc => {
			Skill.find().select('-__v').exec()
				.then(result => {
					res.status(200).json({
						list: result
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
