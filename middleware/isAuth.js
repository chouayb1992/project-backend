const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config({path: '../.env'});

const isAuth = async(req, res, next)=> {
//    console.log("heqders ; " , req.headers);
    try {
       const token = await req.headers['x-auth-token']
    //    console.log("is auth token",token);
       //check if token
       if(!token){
        res.status(400).send({msg:'no token'})
       }
       const decoded = await jwt.verify(token, process.env.SECRET)
       //get user by decoded.id
       const user = await User.findById(decoded.id)
       //check if user
       if(!user){
        return res.status(400).json({msg: 'token not valid'})
       }
       //get user
       req.user = user
       next();
    } catch (error) {
        return res.status(500).json({msg: 'token not valid'})
    }
} 

module.exports = isAuth;