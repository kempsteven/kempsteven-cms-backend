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
		type: String
	},

	portfolioDesktopImg: {
		type: Object,
		required: true
	},

	portfolioMobileImg: {
		type: Object
	}
})

module.exports = mongoose.model('Portfolio', portfolioSchema)