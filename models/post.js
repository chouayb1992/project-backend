const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
      comment: { type: String, required: true },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  )

const postSchema = new mongoose.Schema({
    subject: { type: String, required: true},
    description: { type: String, required: true},
    image: { type: String},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {type: Date, default: Date.now()},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments:[commentSchema]
})

module.exports = mongoose.model("Post", postSchema);