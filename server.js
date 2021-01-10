const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


mongoose.connect("mongodb+srv://root:root@cluster0.6bohf.mongodb.net?retryWrites=true&w=majority",{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}) 
const db =mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connection To Mongoose Successful'))


const indexRouter = require('./routes/index')
const csvRouter = require('./routes/csv_files')


app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb'}))

app.use('/', indexRouter )
app.use('/csv_files', csvRouter )


app.listen(process.env.port || 3000) 