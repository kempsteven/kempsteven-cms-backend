const uniqid = require('uniqid')

class ImageHandler {
	constructor (pathName) {
		// middleware for handling multipart/form-data
		this.multer = require('multer')
		this.uniqid = require('uniqid')

		// setting multer configs
		this.storage = this.multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, `./uploads/${pathName}/`)
			},

			filename: function (req, file, cb) {
				cb(null, `${uniqid()}-${file.originalname}`)
			}
		})

		this.fileFilter = (req, file, cb) => {
			let allowedMimeType = ['image/webp', 'image/jpeg', 'image/png']

			if (allowedMimeType.indexOf(file.mimetype) > -1) {
				cb(null, true)
			} else {
				return cb(new Error('Only ' + allowedMimeType.join(", ") + ' files are allowed!'));
			}
		}

		this.upload = this.multer({
			storage : this.storage, 

			limits: {
				fileSize: 1024 * 1024 * 5
			},

			fileFilter: this.fileFilter
		})
	}

	get getUpload () {
		return this.upload
	}
}

module.exports = ImageHandler
