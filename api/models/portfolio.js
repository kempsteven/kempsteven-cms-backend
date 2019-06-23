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
		type: Object,
		required: true
	},

	portfolioMobileImg: {
		type: Object,
		required: true
	}
})

module.exports = mongoose.model('Portfolio', portfolioSchema)