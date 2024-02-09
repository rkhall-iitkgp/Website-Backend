const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const { loginWithPassword, loginWithOtp } = require("./controller/user")
const { verifyOTP } = require("./controller/user")
const { client }  = require("./redis")
const app = express();
require('dotenv').config()

try {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to mongoose"))
    client.connect();
    client.on("error", err => console.log("Redis client error: ", err));
    client.on("connect", () => console.log("Connected to redis"));
} catch (e) {
    console.log(e)
}

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/loginWithPassword", loginWithPassword)
app.post("/loginWithOtp", loginWithOtp)
app.post("/verify", verifyOTP)
// app.update("/update", up)

app.listen(8000, () => {
    console.log("Listening on port 8000...")
})