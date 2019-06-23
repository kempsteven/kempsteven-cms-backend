const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

//routes
const userRoutes = require('./api/routes/user')
const skillRoutes = require('./api/routes/skill')
const portfolioRoutes = require('./api/routes/portfolio')
// const educationRoutes = require('./api/routes/education')

//consoles route used
app.use(morgan('dev'))

//make folder staticly available
app.use('/uploads', express.static('uploads'))

//note: can be remove since im using formdata
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
app.use('/skill', skillRoutes)
app.use('/portfolio', portfolioRoutes)
// app.use('/education', educationRoutes)

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