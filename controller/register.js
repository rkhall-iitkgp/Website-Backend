const { User } = require("../model/User")
const bcrypt = require('bcryptjs')
exports.register = async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body);
        try {
            await user.validate();
        } catch (e) {
            return res.status(400).json({ success: false, message: e });
        }
        bcrypt.hash(req.body.password,10,function(err, hash) {
            // Store hash in your password DB.
            user.password = hash;
            console.log("hashed password", hash);
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Error in hashing password" });
            }
        });
        await user.save();
        console.log("user registered successfully" , user);
        
        res.status(200).json({ success: true, message: "User registered successfully" });
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ code: -1,success: false, message: e.message })
    }
}