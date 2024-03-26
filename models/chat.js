const mongoose = require("mongoose");

// const commentSchema = mongoose.Schema(
//     {
//       comment: { type: String, required: true },
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User',
//       },
//     },
//     {
//       timestamps: true,
//     }
//   )

const chatSchema = new mongoose.Schema({
    text: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {type: Date, default: Date.now()},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    // comments:[commentSchema]
})

module.exports = mongoose.model("Chat", chatSchema);