
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

userName:{
    type:String,
    required:true
},

email:{
    type:String,
    required:true
    
},

mobile:{
    type:String,
    required:true
},

password:{
    type:String,
    required:true
},

resetPassword:{
    type:String
},

resetPasswordExpires:{
    type:Date
},

role:{
    type:String,
    default:'user'
},

createdAt:{
    type:Date,
    default:Date.now
}
    
})

module.exports = mongoose.model('users',userSchema);