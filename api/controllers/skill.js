const Skill = require('../models/skill')
const mongoose = require('mongoose')

const cloudinary = require('cloudinary').v2

//cloudinary credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
	let propertyNotToUpdate = [
		'oldSkillImgPublicId',
		'imgFileObj'
	]

	if (!!req.body.imgFileObj) {
		req.body.skillImg = req.body.imgFileObj
	}

	// console.log(req.body.skillImg)

	return res.json(req.body.skillImg)

	// setting properties to update and remove property not needed
	let properties = Object.keys(req.body).filter(prop => propertyNotToUpdate.indexOf(prop) <= -1)
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

	//add validation if id is not available
	Skill.deleteOne({_id})
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
