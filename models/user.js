const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    lastName: { type: String, required: true},
    age: { type: Number, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    bio: { type: String},
    image: { type: String},
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]

})

module.exports = mongoose.model("User", userSchema);
