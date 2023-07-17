// set service price 

const mongoose = require("mongoose")

const priceSchema = new mongoose.Schema({

generalServicePrice : {
    type : Object
},
repairServicePrice : {
    type : String
},
washServicePrice : {
    type : String
}

})


module.exports  = mongoose.model('prices' , priceSchema)