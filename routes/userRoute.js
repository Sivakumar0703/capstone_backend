const userRouter = require("express").Router();
const userModel = require('../models/userModel'); // using the user collection
const { hashPassword, hashCompare,createToken } = require('./authorization');
const nodemailer = require('nodemailer')


// get all user
userRouter.get('/',async(req,res)=>{
    try {
        let user = await userModel.find({} , {"password":0});
        res.status(200).json({user,message:"done"})
    } catch (error) {
        res.send({message:"unable to get user data",error})
    }
})

// new user registration
userRouter.post('/signup', async (req, res) => {
   
//const newUser = new User(req.body)
    try {

        let hashedPassword = await hashPassword(req.body.password)
        req.body.password = hashedPassword

        let user = await userModel.findOne({ email: req.body.email })
        
        if (!user) {
            let user = await userModel.create(req.body);// get data from body(front end)
            res.status(201).json({
                message: "Signup successfull"
            })
        } else {
            res.status(400).json({ message: "user already exist!" })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })

    }

})



// registered user login
userRouter.post('/login', async (req, res) => {
    try {
        
        let user = await userModel.findOne({ email: req.body.email });

        if (user) {
            
            if(await hashCompare(req.body.password , user.password)){
                //create token
                let token = await createToken({
                    userName:user.userName,
                    email:user.email,
                    id:user._id,
                    role:user.role
                })
                let userdata = await({
                    userName:user.userName,
                    email:user.email,
                    id:user._id,
                    role:user.role
                })

                res.status(200).json({
                    message: "Login successfull",
                    token,
                   userdata     
                })
                
            } else {
                res.status(400).json({ message: "invalid password" })
            }
        } else {
            res.status(400).json({ message: "Wrong Email Id" })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error!",
            error: error
            
        })

    }

})

// contact page - mail
userRouter.post('/send_mail' , async(req , res) => {
    const contact_us_msg = req.body;
    console.log(contact_us_msg)
    try {
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
               // user : 'ssivakumar358@gmail.com',
                //pass : 'oxymmzjbnnrpuvwr'
                user : process.env.USER ,
                pass : process.env.PASS
            }
        })
        const mailOption = {
            from : process.env.USER , // mail id of the respective client page(web page)
            to : process.env.RECEIVING_MAIL_ID ,  // to receive mail - it shows the client req msg
            subject : 'Online Bike Service' ,
            html : 
            `
             <li> <h4> REQUEST/FEEDBACK FROM CLIENT </h4> </li> <ul>
             <li> <p> Client Name : ${contact_us_msg.userName} </p> </li>
             <li> <p>  Email : ${contact_us_msg.email} </p> </li>
             <li> <p>  Mobile Number : ${contact_us_msg.mobile} </p> </li>
             <li> <p> Client Request/Feedback : ${contact_us_msg.message} </p> </li>
            </ul> `
        }
        transporter.sendMail(mailOption , (error , info) => {
                 if(error){
                     console.log(error);
                 } else {
                    console.log(`Email sent successfully : ${info.response}`)
                    res.status(200).send('mail sent successfully')
                 }
        })
        transporter.close()
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!", error: error , spot:"error in nodemailer"})
    }
})





module.exports = userRouter;