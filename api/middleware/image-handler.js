// // //middleware for handling multipart/form-data
// const multer = require('multer')

// // let uploadPath

// // setting multer configs
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, `./uploads/${uploadPath}/`)
// 	},

// 	filename: function (req, file, cb) {
// 		cb(null, `${Date.now()}-${file.originalname}`)
// 	}
// })

// const fileFilter = (req, file, cb) => {
// 	let allowedMimeType = ['image/webp', 'image/jpeg', 'image/png']

// 	if (allowedMimeType.indexOf(file.mimetype) > -1) {
// 		cb(null, true)
// 	} else {
// 		return cb(new Error('Only ' + allowedMimeType.join(", ") + ' files are allowed!'));
// 	}
// }

// const upload = multer({
// 	storage : storage, 

// 	limits: {
// 		fileSize: 1024 * 1024 * 5
// 	},

// 	fileFilter: fileFilter
// })

class ImageHandler {
	constructor (pathName) {
		this.multer = require('multer')

		this.storage = this.multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, `./uploads/${pathName}/`)
			},

			filename: function (req, file, cb) {
				cb(null, `${Date.now()}-${file.originalname}`)
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
		// uploadPath = pathName
	}

	get getUpload () {
		//  return const upload
		return this.upload
	}
}

module.exports = ImageHandler
