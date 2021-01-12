const express = require('express')
const router = express.Router()
const csvParser = require('csv-parser')
const fs = require('fs')
const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
const File = require("../models/file.model")



mongoose.connect("mongodb+srv://root:root@cluster0.6bohf.mongodb.net?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connection To Mongoose Successful'))



router.get('/', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (e) {
        res.status(500).json({ message: e })
    }
})


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
            }).catch(error => {
                res.status(500).json({ message: error })
            });

        }).catch(e => {
            res.status(400).json({ message: e })
        });
})

router.get('/:id', async (req, res) => {
    try {
        const file = await File.findOne({ _id: ObjectId(req.params.id) });
        res.status(200).json(file);
    } catch (e) {
        res.status(500).json({ message: r })
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const removeFile = await File.remove({ _id: ObjectId(req.params.id) });
        res.status(200).json(removeFile);
    } catch (e) {
        res.status(500).json({ message: e })
    }
})

module.exports = router