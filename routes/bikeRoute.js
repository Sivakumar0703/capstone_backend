const bikeRouter = require("express").Router()
const bikeModel = require("../models/bikeModel")


// get all bikes data
bikeRouter.get("/", async(req, res) => {
    try {
        let bikes = await bikeModel.find();
        res.status(200).json({bikes,message:"successfully fetched every bike data"})
    } catch (error) {
        res.status(400).json({message:"not able to get bike data",error})
    }
});

// Add New Bike
bikeRouter.post("/addbike", (req, res) => {

    const {bikeCompany , model , cc , image} = req.body;

    const newbike = new bikeModel({
        bikeCompany: bikeCompany,
        model: model,
        cc: cc,
        image:image
    });

    newbike.save()
        .then((response) => {
            if (response._id) {
                return res.status(200).json({
                    message:"bike added successfully",
                    response
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error : "error in adding new bike",error
            })
        })
});

// delete bike data
bikeRouter.delete("/delete/:id", async(req, res) => {
    try {
       await bikeModel.findByIdAndDelete(req.params.id).then((res) => console.log(res))
     res.status(200).json({message:"bike data is deleted" , isdeleted:true})
    } catch (error) {
     res.status(500).json({message:"bike does't exists in your database" , error})
     console.log(error)
    }
        
 });




module.exports = bikeRouter;