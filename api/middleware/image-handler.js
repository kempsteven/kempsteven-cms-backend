// //middleware for handling multipart/form-data
const multer = require('multer')

let uploadPath

// setting multer configs
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `./uploads/${uploadPath}/`)
	},

	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})

const fileFilter = (req, file, cb) => {
	let allowedMimeType = ['image/webp', 'image/jpeg', 'image/png']

	if (allowedMimeType.indexOf(file.mimetype) > -1) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

const upload = multer({
	storage : storage, 

	limits: {
		fileSize: 1024 * 1024 * 5
	},

	fileFilter: fileFilter
})

class ImageHandler {
	constructor (pathName) {
		// setting foldername when uploading image
		uploadPath = pathName
	}

	get upload () {
		//  return const upload
		return upload
	}
}

module.exports = ImageHandler
