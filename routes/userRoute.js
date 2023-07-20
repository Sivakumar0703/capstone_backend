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
const {userName , mobile , email , password } = req.body

    try {

        let hashedPassword = await hashPassword(req.body.password)
        req.body.password = hashedPassword

        let user = await userModel.findOne({ email: req.body.email })
        
        if (!user) {
            const newUser = new userModel ({
                userName,
                email,
                mobile,
                password : hashedPassword
            })
          //  let user = await userModel.create(req.body);// get data from body(front end)
          await newUser.save();
            res.status(201).json({
                message: "Signup successfull"
            })
        } else {
            res.status(400).json({ message: "user already exist!" })
            console.log(user)
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
                     res.status(404).json({message:'something went wrong.'})
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


// forgot password - otp generation
userRouter.post('/forgot_password' , async(req,res) => {

    const user = await userModel.findOne({email:req.body.email}); 
    console.log(user , 'user')

    if(!user){
        return res.status(404).json({message:'user not found'})
    }

     user.resetPassword = Math.random().toString(36).slice(-8); // Generate OTP 
     user.resetPasswordExpires = Date.now() + 900000; // expire time 15 minutes 

     await user.save();

     // sending mail to reset password
     const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.USER ,
            pass : process.env.PASS
        }
    })
    const mailOption = {
        from : process.env.USER , 
        to : process.env.RECEIVING_MAIL_ID,//email , // user email
        subject:'PASSWORD RESET REQUEST',
        text:` Hi , ${user.userName} \n Forgot Your Password? \n We received a reset password request from your account \n\n
                Your OTP for ${user.email} is ${user.resetPassword} \n OTP expires in 15 minutes `
    }

    transporter.sendMail(mailOption , (error , info) => {
        if(error){
            res.status(404).json({message:'something went wrong.'})
        } else {
           res.status(200).json({message:'mail sent successfully'  , info})
        }
})
transporter.close()

})


// reset password using otp
userRouter.post('/reset_password/:passcode' , async(req,res) =>{
    const {passcode} = req.params;
    console.log('code' , passcode)
    const {password} = req.body;
    console.log(Date.now() , Date.now()+3600000)

    const user = await userModel.findOne({
        resetPassword:passcode,
        resetPasswordExpires:{$gt:Date.now()}
    })

    
    if(!user){
        return res.status(400).json({message:'OTP EXPIRED / OTP MISMATCH'})
    }

    const hashedPassword = await hashPassword(password)
    user.password = hashedPassword;
    user.resetPassword = '';
    user.resetPasswordExpires = '';

    await user.save();

    res.status(200).json({message:'reset passsword successful'})

})


























module.exports = userRouter;