const mongoose = require('mongoose')

const portfolioSchema = mongoose.Schema({
	portfolioTitle: {
		type: String,
		required: true
	},

	portfolioDescription: {
		type: String,
		required: true
	},

	portfolioTechnologies: {
		type: String,
		required: true
	},

	portfolioUrl: {
		type: String,
		required: true
	},

	portfolioDesktopImg: {
		type: String,
		required: true
	},

	portfolioMobileImg: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('Portfolio', portfolioSchema)