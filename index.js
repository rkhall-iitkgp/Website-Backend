const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const { loginWithPassword, loginWithOtp } = require("./controller/user")
const { update } = require("./controller/update")
const { register } = require("./controller/register")
const { verifyOTP } = require("./controller/user")
const  {authenticateToken} = require("./middlewares/auth")
const { getUserData } = require("./controller/dashboard")
const { client } = require("./redis")
const app = express();
require('dotenv').config()

try {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to mongoose"))
    client.connect("redis://red-cn37f87109ks73eo6930:6379");
    client.on("error", err => console.log("Redis client error: ", err));
    client.on("connect", () => console.log("Connected to redis"));
} catch (e) {
    console.log(e)
}

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post("/login/password", loginWithPassword)
app.post("/login/otp", loginWithOtp)
app.post("/login/verify", verifyOTP)
// app.put("/update", authenticateToken, update)
app.get("/dashboard",authenticateToken,getUserData)
app.post("/register", register)
app.listen(8000, () => {
    console.log("Listening on port 8000...")
})