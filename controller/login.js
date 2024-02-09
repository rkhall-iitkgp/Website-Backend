const bcrypt = require("bcryptjs")
const speakeasy = require("speakeasy")
const jwt = require("jsonwebtoken")
const { User } = require("../model/User")
const { sendMail } = require("./sendmail")
const { client } = require("../redis")

exports.loginWithPassword = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(400).json({ success: false, message: "Please enter email and password" });

        const user = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
        if (!user) return res.status(400).json({ success: false, message: "User does not exist" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ success: false, message: "Invalid password" });
        delete user.password;
        jwt.sign({ userId: user }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME }, async (err, token) => {
            if (err) return res.status(400).json({ success: false, message: "Login error" });
        })
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
}

exports.loginWithOtp = async (req, res) => {
    try {
        if (!req.body.email) return res.status(400).json({ success: false, message: "Please enter email" });

        const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("email").exec();
        if (!user) return res.status(400).json({ success: false, message: "User does not exist" });

        const secret = speakeasy.generateSecret({ length: 20 });
        console.log(secret)

        // Generate OTP
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: "base32"
        });

        // Send OTP to user (e.g., via email or SMS)
        sendMail(req.body.email, otp);
        // save the secret key in the user object or database
        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" });
        await client.set(user.email, secret.base32, { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Redis client error" });
            }
            console.log(res);
        });

        await user.save();
        return res.status(200).json({ success: true, message: "OTP sent to your email" });
     } catch (e) {
        console.log(e)
        res.status(400).json({ success: false, message: e.message })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) return res.status(400).json({ success: false, message: "Please enter OTP" });

        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" });
        const secret = await client.get(req.body.email, (err, res) => {
            if (err) console.log(err);
            console.log(res);
        });

        // Verify OTP
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "base32",
            token: otp,
            window: 1 // Allow 1-time step tolerance in verification
        });

        if (verified) {
            // OTP verification successful
            // Proceed with login logic
            const user = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
            jwt.sign({ userId: user }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME }, (err, token) => {
                if (err) return res.status(400).json({ success: false, message: "Login error" });
                return res.status(200).json({ success: true, message: "Login successful", token });
            });
            // res.status(200).json({ success: true, message: "OTP verification successful" });
        } else {
            // OTP verification failed
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
}
