const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const secretKey = "nefl$CJ*KLJDK#@bnK";
const secretKey = process.env.SECRET_KEY;


// masking password
const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}

// compare password
const hashCompare = async (password, hashedPassword) => { // password = req.body.password(from Application) & hashedPassword = user.password(from DB)
    return await bcrypt.compare(password, hashedPassword)

}

// token generation
const createToken = async (payload) => { // name,email,id,role

    let token = await jwt.sign(payload, secretKey)

    return token
}


module.exports = { hashPassword, hashCompare, createToken }