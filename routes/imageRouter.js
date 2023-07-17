
const pictureRouter = require("express").Router();
const imageModel = require('../models/imageModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// storage engine 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

// setting storage
const upload = multer({storage:storage});

// get request
pictureRouter.get('/' , async(req,res) => {
    try {
        const result = await imageModel.find();
        res.status(200).json({message:'data fetching done' , result})
    } catch (error) {
        res.status(400).json({message:'data fetching failed' , error:error})
    }
})

// post request
pictureRouter.post('/upload/image' , upload.single('image') , (req,res) => {
    console.log('file',req.file)
    try {
        const data = imageModel({
            image : req.file.filename,
            email : req.body.email
        })
        data.save()
        res.status(200).json({message:'success'})
    } catch (error) {
       res.status(400).json({message:'failed'})  
    }
})


// update request
pictureRouter.put('/update/profile/picture' , upload.single('image') , async(req,res) => {
    try {
        // deleting previous image from the server
         if(req.body.previousImage){
            fs.unlink(`./public/images/${req.body.previousImage}` , (error) => {
                if(error){
                    console.log(error)
                } else {
                    console.log('image deleted')
                }
             })
         }
         
         // updating new image to the database 
        const image = req.file.filename;
        const update = await imageModel.updateOne({email:req.body.email} , {image:image} )
        res.status(200).json({message:'update success'})
    } catch (error) {
       res.status(400).json({message:'update failed' , error}) 
    }
})  


module.exports = pictureRouter;