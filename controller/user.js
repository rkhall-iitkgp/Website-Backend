const bcrypt = require("bcryptjs")
const speakeasy = require("speakeasy")
const jwt = require("jsonwebtoken")
const { User } = require("../model/User")
const { sendMail } = require("./sendmail")

exports.loginWithPassword = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(400).json({ success: false, message: "Please enter email and password" });
    
        const user = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
        if (!user) return res.status(400).json({ success: false, message: "User does not exist" });
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ success: false, message: "Invalid password" });
        delete user.password;
        jwt.sign({ userId: user }, process.env.SECRET_KEY, { expiresIn: "15d" }, (err, token) => {
            if (err) return res.status(400).json({ success: false, message: "Login error" });
            return res.status(200).json({ success: true, message: "Login successful", token });
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
        user.secret = secret.base32;
        await user.save();
        return res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) return res.status(400).json({ success: false, message: "Please enter OTP" });

        const user = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
        if (!user) return res.status(400).json({ success: false, message: "User does not exist" });

        const secret = user.secret; // Retrieve the secret from the user object or database

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
            jwt.sign({ userId: user }, process.env.SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
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

exports.register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(400).json({ success: false, message: "Please enter email and password" });

        const user = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
        if (user) return res.status(400).json({ success: false, message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            email: req.body.email.toLowerCase(),
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).json({ success: true, message: "User registered successfully" });
    }
    catch {
        res.status(400).json({ success: false, message: e.message })
    }
}