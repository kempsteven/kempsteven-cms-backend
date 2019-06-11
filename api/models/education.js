const mongoose = require('mongoose')

const educationSchema = mongoose.Schema({
	education: {
		type: String
	},

	awards: {
		type: String
	},
})

module.exports = mongoose.model('Education', educationSchema)