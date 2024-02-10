const { User } = require('../model/User');

exports.update = async (req, res) => {

    const { name, rollNo, phoneNo, yearOfPassing, personalEmail, instiEmail, dateOfBirth, department, emergencyPhoneNo } = req.body;

    const email = req.user.email;

    const user = await User.findOneAndUpdate({ email: email }, { name, rollNo, phoneNo, yearOfPassing, personalEmail, instiEmail, dateOfBirth, department, emergencyPhoneNo }, { new: true });
    if (!user) return res.status(400).send('User not found');
    user.save();
    res.status(200).send(user);
}