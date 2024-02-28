const {sendMail} = require('./sendmail_password')
const {User} = require('../model/User')



exports.forgotPassword = async (req, res) => {
    try {
      const user = await User.findOne({ personalEmail: req.body.personalEmail });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }
      
  
      const resetPasswordToken = user.getresetpasswordtoken();
  
      await user.save();
  
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/password/reset/${resetPasswordToken}`;
  
      const message =
      {

        to:user.personalEmail,
        from: {
            name: 'RK HALL IIT KGP',
            email: 'harshit@kgpian.iitkgp.ac.in',
        },
        subject:"Reset Password Request",
        html:`Reset Your Password by clicking on the link below: \n\n ${resetUrl}`
      } 
  
      try {
        await sendMail(message);
  
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.personalEmail}`,
        });
      } 
      
        catch (error) {
        user.resetpasswordtoken = undefined;
        user.resetpasswordexpire = undefined;
        await user.save();
  
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  