const { User } = require('../model/User');

exports.updateInfo = async (req, res) => {
    
    const { name ,rollNo, phoneNo ,yearOfPassing , personalEmail , instiEmail , dateOfBirth , department ,emergencyPhoneNo ,experience,involvements,profilePic,resume} = req.body;
    try {
        const user = await User.findOneAndUpdate({ instiEmail: req.user.instiEmail }, {
            name, rollNo, phoneNo, yearOfPassing, personalEmail, instiEmail, dateOfBirth, department, emergencyPhoneNo, experience, involvements, profilePic, resume
        }, { new: true });

        if (!user) {
            return res.status(400).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}