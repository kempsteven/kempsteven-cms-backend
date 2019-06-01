const mongoose = require('mongoose')
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@kempsteven-cluster-nwuzv.mongodb.net/kempsteven?retryWrites=true&w=majority`

//fix for decrapation warning
mongoose.set('useCreateIndex', true)

//connect to mongodb
mongoose.connect( uri,{ useNewUrlParser: true } )
	.then( () => console.log(`Connected to MongoDB`))
	.catch( err => console.log(err))

//set mongoose promise to node default promis
mongoose.Promise = global.Promise