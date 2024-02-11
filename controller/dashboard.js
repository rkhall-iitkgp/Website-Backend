const mongoose = require('mongoose')
const { User } = require('../model/User')

exports.getUserData = async(req,res)=>{
    try{
        const personalEmail = req.user.personalEmail;
        const user = await User.findOne({personalEmail});
        console.log("user: ",user)
        if(!user) return res.status(400).json({ success: false, message: "User not found" })
        res.status(200).json({ success: true, message:"Request successful" })
        res.send(user)
    }
    catch(e){
        console.log(e)
        res.status(400).json({ success: false, message: e.message })
    }

}