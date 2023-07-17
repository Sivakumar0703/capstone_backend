const mongoose = require("mongoose");

const bikeSchema = mongoose.Schema({

    bikeCompany : {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    cc : {
        type: String,
        required: true 
    },
    image :{
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('bikes', bikeSchema);