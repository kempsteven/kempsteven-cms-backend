const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.user_sign_up = (req, res, next) => {
	User.find({email: req.body.email})
		.exec()
		.then(user => {
			if (user.length > 0) {
				return res.status(422).json({
					message: 'Email already exist'
				})
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err
						})
					} else {
						const user = new User({
							email: req.body.email,
							password: hash
						})

						user
							.save()
							.then(result => {
								console.log(result)
								res.status(200).json({
									user: result.email,
									message: 'User Created'
								})
							})
							.catch(err => {
								console.log(err)
								res.status(500).json({
									error: err
								})
							})
					}
				})
			}
		})
		.catch()
}

exports.user_login_in = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({
					message: 'Authentication failed.' 
				})
			}

			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Authentication failed.' 
					})
				}

				if (result) {
					const token = jwt.sign(
						{
							email: user[0].email,
							userId: user[0]._id
						},
						process.env.JWT_KEY,
						{
							expiresIn: '2 days'
						}
					)

					return res.status(200).json({
						id: user[0]._id,
						email: user[0].email,
						token: token,
						message: 'Authentication successful.' 
					})
				}

				res.status(401).json({
					message: 'Authentication failed.' 
				})
			})
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		})
}

exports.user_refresh_token = (req, res, next) => {

}