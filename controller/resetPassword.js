const crypto = require('crypto');
const {User} = require('../model/User')
const bcrypt = require('bcryptjs')


exports.resetPassword = async (req, res) => {
    try {
      const resetpasswordtoken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
  
      const user = await User.findOne({
        resetpasswordtoken,
        resetpasswordexpire: { $gte: Date.now() },
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token is invalid or has expired",
        });
      }


      user.password = req.body.password;



  
     
  



  
      user.resetpasswordtoken = undefined;
      user.resetpasswordexpire = undefined;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };