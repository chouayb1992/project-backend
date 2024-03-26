const mongoose = require("mongoose");
require("dotenv").config({path: '../.env'})
const connDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connDB