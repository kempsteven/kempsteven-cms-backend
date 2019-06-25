// middleware for handling multipart/form-data
const multer = require('multer')
const uniqid = require('uniqid')

// stores the files in memory as Buffer objects. It doesn't have any options
const storage = multer.memoryStorage()

// filters on multer, see multer docs for more info
const fileFilter = (req, file, cb) => {
	let allowedMimeType = ['image/webp', 'image/jpeg', 'image/png']

	if (allowedMimeType.indexOf(file.mimetype) > -1) {
		cb(null, true)
	} else {
		return cb(new Error('Only ' + allowedMimeType.join(", ") + ' files are allowed!'));
	}
}

//cloudinary is a cloud file storage api
const cloudinary = require('cloudinary').v2

/*
	uniform resource identifier (URI) scheme that provides a way to
	include data in-line in web pages,as if they were external resources
*/
const Datauri = require('datauri')

// provides utilities for working with file and directory paths
const path = require('path')

//instance of Datauri
const dataUri = new Datauri();

//cloudinary credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

class ImageHandler {
	constructor (reqImageKey, uploadPathFolder) {
		this._reqImageKey = reqImageKey

		this.upload = multer({
			storage : storage, 

			limits: {
				fileSize: 1024 * 1024 * 5
			},

			fileFilter: fileFilter
		})

		this.cloudinaryUpload = (req, res, next) => {
			// const uploadPathFolder = res.locals.uploadPath
			console.log('in uploader')
			/*
				memory storage engine stores the files in memory as Buffer objects,
				from multer.
				Buffer class was introduced as part of the Node.js API to 
				enable interaction with octet streams in TCP streams, 
				file system operations, and other contexts.
			*/
			const fileBuffer = req.file.buffer

			// path.extname returns the extention of a file
			const fileExtention = path.extname(req.file.originalname).toString()

			// return an object with mimetype, base64 of the file
			const file = dataUri.format(fileExtention, fileBuffer)

			cloudinary.uploader.upload(
				file.content,
				{public_id: `kempsteven-cms/${uploadPathFolder}/${uniqid()}`}
			).then(result => {
				req.body.imgFileObj = {
					publicId: result.public_id,
					url: result.secure_url
				}

				next()
			}).catch(err => {
				return res.status(500).json({
					error: error
				})
			})

			// // uploads file to cloudinary
			// cloudinary.uploader.upload(file.content, { public_id: `kempsteven-cms/${uploadPathFolder}/${uniqid()}` }, (error, result) => {
			// 	if (error) {
			// 		return res.status(500).json({
			// 			error: error
			// 		})
			// 	}

			// 	req.body.imgFileObj = {
			// 		publicId: result.public_id,
			// 		url: result.secure_url
			// 	}

			// 	next()
			// })
		}

		this.cloudinaryMultipleUpload = async (req, res, next) => {
			// const uploadPathFolder = res.locals.uploadPath
			
			/*
				memory storage engine stores the files in memory as Buffer objects,
				from multer.
				Buffer class was introduced as part of the Node.js API to 
				enable interaction with octet streams in TCP streams, 
				file system operations, and other contexts.
			*/
			let files = []

			// to set into array of objects [{originalName: '', fileBuffer: ''}]
			Object.keys(req.files).forEach((item) => {
				let file = req.files[item].map((itemObj) => {
					return {
						originalname: itemObj.originalname,
						fileBuffer: itemObj.buffer
					}
				})

				files.push(file[0])
			})

			let fileExtention = []

			// set fileExtention, get the extention of the files
			files.forEach((item) => {
				fileExtention.push(path.extname(item.originalname).toString())
			})

			let filesToUpload = []

			// set filesToUpload, get the object with mimetype, base64 of the file
			files.forEach((item, index) => {
				filesToUpload.push(
					dataUri.format(fileExtention[index], item.fileBuffer).content
				)
			})

			// set array of promises
			let uploadPromises = filesToUpload.map((file) => {
				return new Promise((resolve, reject) => {
					cloudinary.uploader.upload(
						file,
						{ public_id: `kempsteven-cms/${uploadPathFolder}/${uniqid()}` },
						(error, result) => {
							if (error) reject(error)
							else resolve(result)
						}
					)
				})
			})

			Promise.all(uploadPromises)
			.then(result =>  {
				let imgFileObj = []

				result.forEach((resultItem) => {
					imgFileObj.push({
						publicId: resultItem.public_id,
						url: resultItem.secure_url
					})
				})

				req.body.imgFileObj = imgFileObj

				next()
			})	
			.catch(error => {
				return res.status(500).json({
					error: error
				})
			})
		}
	}

	get uploadNone () {
		return this.upload.none()
	}

	get multerUploadSingle () {
		return this.upload.single(this._reqImageKey)
	}

	get multerUploadFields () {
		let uploadFields = this._reqImageKey.map((item) => {
			return {
				name: item,
				maxCount: 1
			}
		})

		return this.upload.fields(uploadFields)
	}

	get cloudinaryUploader () {
		return this.cloudinaryUpload
	}

	get cloudinaryUploaderInstance () {
		return cloudinary.uploader
	}
}

module.exports = ImageHandler
