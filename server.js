const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const db = require('./db')
const nodeApp = require('./app')

app.use(nodeApp)

app.listen(port, () => console.log(`App listening on port ${port}!`))