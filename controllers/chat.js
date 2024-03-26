const User = require("../models/user");
const Chat = require("../models/chat")

exports.createChat = async(req, res)=> {
    try {
        const {text} = req.body;
        const user = await User.findOne(req.user._id);
        const newChat = new Chat({ ...req.body, user: user._id})
        await newChat.save()
        user.chats.push(newChat._id)
        user.save()
        return res.status(200).send({msg: "Post is created with success", response: newChat});
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg: "Server error"});
    }
}

exports.getChats = async(req, res)=> {
    try {
        const chats = await Chat.find();
        return res.status(200).send({msg: "Chats are rendred", response: chats});
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg: "Server error"});
    }
}