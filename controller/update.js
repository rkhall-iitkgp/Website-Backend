const { User } = require('../model/user');

exports.update = async (req, res) => {
    
    const { name ,rollNo, phoneNo ,yearOfPassing , personalEmail , instiEmail , dateOfBirth , department ,emergencyPhoneNo    } = req.body;
    
    const user = await User.findOneandUpdate({email:email}, {name, email ,rollNo, phoneNo ,yearOfPassing , personalEmail , instiEmail , dateOfBirth , department ,emergencyPhoneNo    } , {new:true});
    if(!user) return res.status(400).send('User not found');
    user.save();
    res.status(200).send(user);
}