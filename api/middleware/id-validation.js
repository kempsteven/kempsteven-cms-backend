const mongoose = require('mongoose')

class IdValidation {
	constructor (modelObj) {
		this.isIdValid = (req, res, next) => {
			let _id = req.params.id

			if (!mongoose.Types.ObjectId.isValid(_id)) {
				return res.status(404).json({
					message: 'No valid entry found for provided ID'
				})
			}

			modelObj.findById({ _id }).lean()
				.exec()
				.then(doc => {
					if (!doc) {
						return res.status(404).json({
							message: 'No valid entry found for provided ID'
						})
					}

					next()
				})
				.catch(err => {
					return res.status(500).json({
						error: err
					})
				})
		}
	}

	get getIsIdValid () {
		//  return const upload
		return this.isIdValid
	}
}

module.exports = IdValidation