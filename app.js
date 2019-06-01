const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

// middleware for token auth
const tokenAuth = require('./api/middleware/token-auth')

//routes
const userRoutes = require('./api/routes/user')
const skillRoutes = require('./api/routes/skill')

//consoles route used
app.use(morgan('dev'))

//helps receive body from request
//for req json format
app.use(bodyParser.json())

//for req x-www-form-urlencoded format
app.use(bodyParser.urlencoded({extended: true}))

//for cross origin handling
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers', 
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)

	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
		return res.status(200).json({})
	}

	next()
})

//routes that handle request
app.use('/user', userRoutes)
app.use('/skill', tokenAuth, skillRoutes)

//if received route is not found
app.use((req, res ,next) => {
	const error = new Error('Route Not Found')
	error.status = 404

	next(error)
})

//handling error
app.use((error, req, res ,next) => {
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message
		}
	})
})

module.exports = app