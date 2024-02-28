const { User } = require("../model/User");

exports.updatePassword = async (req, res) => {
	try {
		const { password, newPassword } = req.body;
		if (!password || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and New Password are required",
				code: -1,
			});
		}
		const user = await User.findOne({ instiEmail: req.user.instiEmail })
			.select("+password")
			.exec();
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found", code: -2 });
		}
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid password", code: -2 });
		}
		bcrypt.hash(newPassword, 10, async (err, hash) => {
			if (err) {
				return res.status(500).json({
					success: false,
					message: "Error in hashing password",
					code: -4,
				});
			}
			user.password = hash;
			await user.save();
			return res.status(200).json({
				success: true,
				message: "Password updated successfully",
				code: 0,
			});
		});
	} catch (e) {
		console.error(e);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error", code: -5 });
	}
};
