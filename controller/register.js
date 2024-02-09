const { User } = require("../model/User")

exports.register = async (req, res) => {
    try {
        // const user = new User(req.body);
        const user = new User({
            email: "example@gmai.com",
            name: "example",
        })
        
        res.status(200).json({ success: true, message: "User registered successfully" });
    }
    catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
}