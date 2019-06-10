const mongoose = require('mongoose')

const educationSchema = mongoose.Schema({
	education: {
		type: String,
		required: true
	},

	awards: {
		type: String
	},
})

module.exports = mongoose.model('Education', educationSchema)