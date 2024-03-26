const express = require("express");
const router = express.Router();

const { createChat, getChats } = require("../controllers/chat");
const isAuth = require("../middleware/isAuth");

router.post("/chats", isAuth, createChat)
router.get("/chats", isAuth, getChats)
// router.get("/post/:id", getPostById)
// router.delete("/posts/:id", isAuth, deletePost)
// router.put("/posts/:id", updatePost)
// router.post("/posts/:id/like", isAuth, likePost)
// router.post("/posts/:id/comment", isAuth, createPostComment)

module.exports = router