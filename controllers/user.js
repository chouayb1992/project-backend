const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const User = require("../models/user");
const Post = require("../models/post");
require("dotenv").config({path: '../.env'})
const { populate } = require('mongoose');

exports.register = async(req, res)=> {
    try {
        const {name, lastName, age, bio, email, password} = req.body;
        const image = req.file.filename
        //check all fields
        if( !name || !lastName || !age || !email || !password){
            return res.status(400).json({msg: "Enter all fields"});
        }
        let user = await User.findOne({email:email});
        if(user){
            return res.status(400).send({msg: "User already created"});
        }
        const newUser = new User({...req.body, image})
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        newUser.password = hashedPassword
        await newUser.save()
        const payload = {
            id : newUser._id
        }
        const token = await jwt.sign(payload, process.env.SECRET, {expiresIn: '1h'})
        return res.status(200).send({msg: "User created success", user: newUser, token});
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg: "Server error"});
    }
}

exports.login = async(req, res)=> {
    try {
        const {email, password} = req.body;
        //check all fields
        if( !email || !password){
            return res.status(400).json({msg: "Enter all fields"});
        }
        let user = await User.findOne({email:email});
        if(!user){
            return res.status(400).send({msg: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).send({msg: "Password and Email are not identical"});
        }
        const payload = {
            id : user._id
        }
        const token = await jwt.sign(payload, process.env.SECRET, {expiresIn: '1h'})
        return res.status(200).send({msg: "User logged in", user: user, token});

    } catch (error) {
        console.log(error)
        return res.status(500).send({msg: "Server error"});
    }
}

//get user
exports.getUser = async(req, res)=> {
    const user = req.user
    const userr = await User.findById({_id:user._id})
    .populate("followings bookmarks", "name lastName image subject description")
    .exec();
    // console.log(userr)
    return res.status(200).send({user: userr});
}

//get userAllUsers
exports.getUsers = async(req, res)=> {
    const users = await User.find({})
    .populate("followings", "name lastName email")
    .exec();
    return res.status(200).send({response: users});
}

//get user
exports.getUserById = async(req, res)=> {
    const {id} = req.params
    const user = await User.findById(id).populate("posts", "subject")
    return res.status(200).send({msg:'user founded',response: user});
}

//delete user
exports.deleteUser = async(req, res)=> {
    const {id} = req.params
    const user = await User.findByIdAndRemove(id)
    return res.status(200).send({msg:'user deleted'});
}

//update user
exports.updateUser = async(req, res)=> {
    const {id} = req.params
    const user = await User.updateOne({_id:id}, {...req.body})
    return res.status(200).send({msg:'user updated'});
}

//follow user

exports.followUnfollowUser = async(req, res)=> {
    // console.log(req.params);
    const userToBeFollowed = await User.findById(req.params.id)
    // console.log(userToBeFollowed);
    const currentUser = await User.findById(req.user._id)

    if(!userToBeFollowed.followers.includes(req.user._id)){
       await userToBeFollowed.followers.push(req.user._id)
       userToBeFollowed.save()
       await currentUser.followings.push(req.params.id)
       currentUser.save()

       
       return res.status(200).send({msg: "User has been followed this user"});
    }else{
        return res.status(400).send({msg: "User already followed this user"});
    }

}

// unfollow user

exports.unfollow = async(req, res)=> {
    // console.log(req.params);
    const userToBeunFollowed = await User.findById(req.params.id)
    // console.log(userToBeFollowed);
    const currentUser = await User.findById(req.user._id)
    

    if(userToBeunFollowed.followers.includes(req.user._id)){
       await userToBeunFollowed.followers.pop(req.user._id)
       userToBeunFollowed.save()
       await currentUser.followings.pop(req.params.id)
       currentUser.save()

       
       return res.status(200).send({msg: "User has been unfollowed this user"});
    }else{
        return res.status(400).send({msg: "User alreadyyy unfollowed this user"});
    }

}

