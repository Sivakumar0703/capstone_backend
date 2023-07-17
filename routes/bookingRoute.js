const bookingRouter = require("express").Router()
const bookingModel =  require("../models/bookingModel")


// get all general service bookings data 
bookingRouter.get("/", async(req, res) => {
    try {
        let bookings = await bookingModel.find();
        res.status(200).json({bookings,message:"successfully fetched every booking data"})
    } catch (error) {
        res.status(400).json({message:"not able to get bookings data",error})
    }
});


// Add New Booking - general service
bookingRouter.post("/general/service/addbooking", (req, res) => {

    const {bike , date, mobile , model , name , register , email ,serviceType ,time , orderId , price , userId} = req.body;

    const generalBooking = new bookingModel({
        bike,
        serviceDate:date,
        mobile,
        model,
        name,
        time,
        register,
        email,
        serviceType,
        orderId,
        paid:price,      
        userId
    });

    generalBooking.save()
        .then((response) => {
            if (response._id) {
                return res.status(200).json({
                    message:"booking added successfully",
                    response
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error : "error in adding new booking",error
            })
        })
});

//  Add New Booking - repair service 
 bookingRouter.post("/repair/service/addbooking", (req, res) => {

    const {name , mobile , email , bike , model , address1 , address2 , pincode , serviceType , serviceDate , time , paid , homeService , userId , orderId} = req.body;
    const repairHomeBooking = new bookingModel({
      
        name,
        mobile,
        email,
        bike,
        model,
        address1,
        address2,
        pincode,
        serviceType,
        serviceDate,
        time,
        paid,
        homeService,
        userId,
        orderId
       
    });

    const repairBooking = new bookingModel({
      
        name,
        mobile,
        email,
        bike,
        model,
        serviceType,
        serviceDate,
        time,
        paid,
        homeService,
        userId,
        orderId
       
    });

    if(req.body.homeService){
        repairHomeBooking.save()
        .then((response) => {
            if (response._id) {
                return res.status(200).json({
                    message:"booking added successfully",
                    response
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error : "error in adding new booking",error
            })
        })

    } else {
        repairBooking.save()
        .then((response) => {
            if (response._id) {
                return res.status(200).json({
                    message:"booking added successfully",
                    response
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error : "error in adding new booking",error
            })
        })
    }
});

//  Add New Booking - water wash service 
bookingRouter.post("/water/wash/service/addbooking", (req, res) => {


    const {name , mobile , email , bike , model , address1 , address2 , pincode , serviceType , serviceDate , time , homeService , userId , paid , orderId} = req.body;
     const waterWashHomeBooking = new bookingModel({
      
        name,
        mobile,
        email,
        bike,
        model,
        address1,
        address2,
        pincode,
        serviceType,
        serviceDate,
        time,
        homeService,
        userId,
        paid,
        orderId
       
    });

    const waterWashBooking = new bookingModel({
      
        name,
        mobile,
        email,
        bike,
        model,
        serviceType,
        serviceDate,
        time,
        homeService,
        userId,
        paid,
        orderId
       
    });

    if(req.body.homeService) {
        waterWashHomeBooking.save()
        .then((response) => {
            if (response._id) {
                return res.status(200).json({
                    message:"booking added successfully",
                    response
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error : "error in adding new booking",error
            })
        })

    } else {
        waterWashBooking.save()
        .then((response) => {
            if (response._id) {
                return res.status(200).json({
                    message:"booking added successfully",
                    response
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error : "error in adding new booking",error
            })
        })

    }       
});


module.exports = bookingRouter;