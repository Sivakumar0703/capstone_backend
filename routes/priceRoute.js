const priceRouter = require("express").Router();
//const { response } = require("../app");
const priceModel = require("../models/priceModel");


// get all service price data
priceRouter.get('/' , async(req,res) => {
    try {
        let price = await priceModel.find();
        res.status(200).json({message:'price data fetched successfully' , price})
    } catch (error) {
        res.status(400).json({message:'price data fetching failed' , error})

    }
})

// post all service price data
priceRouter.post('/allotPrice' , async(req,res) => {
    const {generalServicePrice , repairServicePrice , washServicePrice} = req.body
    try {
        let setPrice = new priceModel({
            generalServicePrice,
            repairServicePrice,
            washServicePrice
        })

        setPrice.save()
        .then(response => res.status(200).json({message:'price allotment successful' , response}))
        .catch(err => res.status(400).json({message:'price allotment failed' , err}))
    } catch (error) {
        res.status(500).json({message:'internal server problem' , error})
    }
})


// update price
priceRouter.put('/update/:id' , async(req,res) => {
    try {
       
        let update = await priceModel.updateOne({_id:req.params.id} , req.body )
        res.status(200).json({message:'price list updated' , update})
        
    } catch (error) {
        res.status(400).json({message:'update failed' , error})
    }
})


module.exports = priceRouter;