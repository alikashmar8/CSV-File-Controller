const mongoose = require("mongoose");

var FileSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    records: [{
        username: String,
        password: String
    }]
});

module.exports =  mongoose.model("files", FileSchema)