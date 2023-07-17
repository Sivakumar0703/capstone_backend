const Razorpay = require('razorpay');
const razorRouter = require("express").Router();

var razorpay = new Razorpay({
   // key_id: 'rzp_test_f3Zt6s7fSoiZSu',
    key_id : process.env.KEY_ID ,
    key_secret : process.env.KEY_SECRET
    //key_secret : 'ObqLEeSpRqphtxBZI88ju0E7' ,
    });

    // creating an order

    razorRouter.post('/order' , (req,res)=>{
        let {amount} = req.body
        console.log('request' , req.body)
        var options = {
            amount: amount * 100,// 500 * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };

          razorpay.orders.create(options, function(err, order) { // for every transaction a new order id is generated
            console.log('newly generated order id from backend razorpay.js',order);
            console.log('error',err)
            res.send({orderId : order?.id})
          });
    })

// payment verfication

razorRouter.post("/api/payment/verify",(req,res)=>{

  let body=req.body.orderId + "|" + req.body.paymentId;
 
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', 'ObqLEeSpRqphtxBZI88ju0E7')
                                   .update(body.toString())
                                   .digest('hex');
   var response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.signature)
    response={"signatureIsValid":"true"}
       res.send(response);
   }); 

module.exports = razorRouter