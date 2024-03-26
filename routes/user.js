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


const { register, login, getUser, getUsers, getUserById, deleteUser, updateUser, followUnfollowUser, getUserFollowings, unfollow} = require("../controllers/user");
const isAuth = require("../middleware/isAuth");
const { getUserPosts } = require("../controllers/post");

router.post("/register", upload.single("image"), register)
router.post("/login", login)
router.get("/user", isAuth, getUser)
router.get("/users", getUsers)
router.get("/users/:id", getUserById)
router.delete("/users/:id", deleteUser)
router.put("/users/:id", updateUser)
router.post("/usersfollowUnfollow/:id", isAuth ,  followUnfollowUser)
router.put("/unfollow/:id", isAuth ,  unfollow)
// router.get("/usersunfollow/:id", isAuth ,  UnfollowUser)
router.get("/users/:id/posts", getUserPosts)

module.exports = router

