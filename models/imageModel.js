const mongoose = require("mongoose");


const pictureSchema = new mongoose.Schema({

    image: {
        type:String
    },

    email: {
        type: String
    }

})

module.exports = mongoose.model('latestimages', pictureSchema);

