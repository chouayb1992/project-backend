const path = require('path');
const express = require('express');
const multer = require ('multer');
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
    console.log("first")

  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
  
})


function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  console.log("second")

  if (extname && mimetype) {
    console.log("three")
    return cb(null, true)
  } else {
    cb('Images only!')
    console.log("three123")

  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
    console.log("four")

  },
})



module.exports =  upload.single('image')