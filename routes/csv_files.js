const express = require('express')
const router = express.Router()
const csvParser = require('csv-parser') 
const fs = require('fs')
const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
const FileType = require('file-type');



mongoose.connect("mongodb+srv://root:root@cluster0.6bohf.mongodb.net?retryWrites=true&w=majority",{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}) 
const db =mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connection To Mongoose Successful'))

var results = []

var files = []

//all csv files
router.get('/', (req, res) => {
    var cur = db.collection('files').find()
    files = []
    cur.forEach(function(doc, err){
        files.push(doc)
    }, function(){
        res.render("csvs/index", {files: files})
    })
})


//redirect to create view
router.get('/create', (req, res) => {
    res.render("csvs/create")
})


//store file
router.post('/store', (req, res) => {
    results = [];
    fs.createReadStream(req.body.csvFile).pipe(csvParser({}))
    .on('data', (data) => results.push(data))
    .on('end', () =>{

        file = {
            name: req.body.csvFile,
            date: Date.now(),
            records : results
        },

        db.collection("files").insertOne(file, function(err, res){
            console.log('file inserted!')
        })
        res.redirect('/csv_files')

    })
 
    
})

// show file details
router.get('/:id', (req, res) => {
    console.log("show")
    var data = {};
    db.collection("files").findOne({_id:ObjectId(req.params.id)}).then(function(resp){
        data = resp
        res.render("csvs/show", { file: data})

    });
})


// delete file
router.post('/delete/:id', (req, res) => {
    console.log("delete")
    console.log(req.params.id)
    db.collection("files").deleteOne({_id:ObjectId(req.params.id)})
    .then(function(resp){
        console.log("delete")
        console.log(resp)
        res.redirect('/csv_files')

    });
})

module.exports = router