const express = require('express')
const router = express.Router()
const csvParser = require('csv-parser')
const fs = require('fs')
const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
const FileType = require('file-type');
const File = require("../models/file.model")



mongoose.connect("mongodb+srv://root:root@cluster0.6bohf.mongodb.net?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connection To Mongoose Successful'))

var results = []


//all csv files
router.get('/', async (req, res) => {
    try {
        const files = await File.find();

        res.status(200).json(files);
        // uncomment follwing line to see data in view (comment above line too)
        // res.render("csvs/index", {files: files})

    } catch (e) {
        res.json({ message: e })
    }
})


//redirect to create view
router.get('/create', (req, res) => {
    res.render("csvs/create")
})


//store file
router.post('/store', async (req, res) => {
    results = [];
    await fs.createReadStream(req.body.csvFile).pipe(csvParser({}))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const file = new File({
                name: req.body.csvFile,
                date: Date.now(),
                records: results
            })
            await file.save().then(data => {
                res.status(201).json(data);
                // uncomment follwing line to see data in view (comment above line too)
                // res.redirect('/csv_files')
            }).catch(error => {
                res.status(500).json({ message: error })
            });

        }).catch(e => {
            res.status(400).json({ message: e })
        })


})

// show file details
router.get('/:id', (req, res) => {
    console.log("show")
    var data = {};
    db.collection("files").findOne({ _id: ObjectId(req.params.id) }).then(function (resp) {
        data = resp
        res.render("csvs/show", { file: data })

    });
})


// delete file
router.post('/delete/:id', (req, res) => {
    console.log("delete")
    console.log(req.params.id)
    db.collection("files").deleteOne({ _id: ObjectId(req.params.id) })
        .then(function (resp) {
            console.log("delete")
            console.log(resp)
            res.redirect('/csv_files')

        });
})

module.exports = router