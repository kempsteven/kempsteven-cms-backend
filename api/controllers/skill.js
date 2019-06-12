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

	if (!!req.file) {
		req.body.skillImg = req.file.path.replace(/\\/g, '/')
	}

	if (req.body.oldSkillImg && !!req.file) {
		if (fs.existsSync(req.body.oldSkillImg)) {
			fs.unlink(req.body.oldSkillImg, (error) => {
				if (error) console.log(error)
			})
		}
	}

	// setting properties to update and remove property not needed
	let properties = Object.keys(req.body).filter(prop => prop !== 'oldSkillImg')
	for(const property of properties) {
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
	let oldImageFilePath = ''
	
	if (!req.body.oldSkillImg) {
		return res.status(500).json({
			error: 'oldSkillImg key are required!'
		})
	}

	// check if old path exist and remove it
	if (req.body.oldSkillImg) {
		if (fs.existsSync(req.body.oldSkillImg)) {
			fs.unlink(req.body.oldSkillImg, (error) => {
				if (error) console.log(error)
			})
		}
	}

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
