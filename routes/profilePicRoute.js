
const imageRouter = require("express").Router();
const profilePicModel = require("../models/profilePicModel");
const imageModel = require('../models/profilePicModel');
const multer = require('multer')
const fs = require('fs')

/*
const Storage = multer.diskStorage({
  //  destination:'uploads',
    destination:(req , file , cb) => {
        cb(null , './public/images')
    },
    filename:(req,file,cb) => {
        cb(null , file.originalname);
    }
});

const upload = multer({
    storage : Storage
}).single('file')

imageRouter.post('/uploadImage' , (req,res) => {
    upload(req,res,(err) => {
        if(err){
            console.log(err);
        } else {
            console.log('request body',req.body)
            const image = new imageModel({
                imageName : req.body.imageName,
                image : {
                    data:req.file.filename,
                    contentType:'image/jpg'
                },
                email:req.body.email
                
            })
            image.save()
            .then(() => res.send("image successfully uploaded"))
            .catch(err => console.log(err , 'img upload'))
        }
    })
})
*/

imageRouter.get('/' , async(req,res) => {
    try {
        let image = await imageModel.find();
     //  let result = image.toString('base64')
        console.log(image.toString('base64') , 'image...')
        res.status(200).json({message:'image data fetched successfully' , image})
       // res.status(200).send(result)
    } catch (error) {
        res.status(400).json({message:'image data fetching failed' , error})

    }
})


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
         cb(null,file.originalname)
    }
})

const upload = multer({storage:storage})

imageRouter.post('/uploadImage' , upload.single('file'),(req,res)=>{
    console.log(req , 'req data')
    console.log(req.file , 'file uploaded')
    const saveImage = profilePicModel({
        imageName:req.body.imageName,
        image:{
            data:fs.readFileSync('uploads/' + req.file.filename),
            //data:req.file.filename ,
            contentType : "image/jpeg"
        },
        email:req.body.email
    });
    saveImage.save()
    .then((res) => console.log('image is saved'))
    .catch((err) => console.log(err , 'error in image upload'))
    res.send('image saved')
})

// imageRouter.post('/uploadImage' , upload.single('file') , (req,res) => {
//     console.log(req.body)
//     console.log(req.file , 'file')
// })

module.exports = imageRouter;