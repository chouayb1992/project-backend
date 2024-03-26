const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connDB = require("./config/connDB")
const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")
const chatRoutes = require("./routes/chat")
// const uploadRoutes = require("./routes/upload")

const app = express();

app.use(express.json())
app.use(cors())
// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use("/api", userRoutes)
app.use("/api", postRoutes)
app.use('/api', chatRoutes)
// app.use('/api', uploadRoutes)

connDB();





const PORT = process.env.PORT || 4000;

app.listen(PORT, (err)=>
err ? console.log(err) :
console.log(`Server running on ${PORT}`))


