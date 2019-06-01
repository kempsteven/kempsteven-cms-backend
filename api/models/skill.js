const mongoose = require('mongoose')

const skillSchema = mongoose.Schema({
	skillName: {
		type: String,
		required: true
	},

	skillLevel: {
		type: String,
		required: true
	},

	skillImg: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('Skill', skillSchema)