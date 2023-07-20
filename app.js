const express = require("express");
const app_server = express();
require("./Database/dbconfiguration");
const cors = require('cors')
require('dotenv').config({path:'./.env'});



// routes
const bikeRouter = require("./routes/bikeRoute");
const bookingRouter = require("./routes/bookingRoute");
const userRouter = require("./routes/userRoute");
const razorRouter = require("./routes/razorpay");
const priceRouter = require("./routes/priceRoute");
const pictureRouter = require("./routes/imageRouter");


//middleware
app_server.use(cors());
app_server.use(express.json());
app_server.use(express.static('./public'));

app_server.use("/bikes" , bikeRouter);
app_server.use("/bookings" , bookingRouter);
app_server.use("/users" , userRouter);
app_server.use("/razorpay" , razorRouter);
app_server.use("/image" , pictureRouter);
app_server.use("/service/price" , priceRouter);


module.exports = app_server;