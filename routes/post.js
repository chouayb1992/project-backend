const express = require("express");
const router = express.Router();
const multer = require('multer')
const path = require("path");


const storageEngine = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  });

  const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
  
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
    const mimeType = fileTypes.test(file.mimetype);
  
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: You can Only Upload Images!!");
    }
  };

  const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 50000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  });

const { createPost, getPostById, deletePost, updatePost, getPosts, getUserPosts, likePost, createPostComment, getTopPosts, getFollowingPosts, savePost, getBookmarkedPosts} = require("../controllers/post");
const isAuth = require("../middleware/isAuth");

router.post("/posts", isAuth, upload.single("image") ,createPost)
router.get("/posts/", isAuth, getUserPosts)
router.get("/post/:id", getPostById)
router.get("/posts/top", getTopPosts)
router.delete("/posts/:id", isAuth, deletePost)
router.put("/posts/:id", updatePost)
// router.get("/posts", getPosts)
router.post("/posts/:id/like", isAuth, likePost)
router.post("/posts/:id/save", isAuth, savePost)
router.get("/posts/bookmarks", isAuth, getBookmarkedPosts)
router.post("/posts/:id/comment", isAuth, createPostComment)
router.get("/timeline", isAuth, getFollowingPosts)


module.exports = router