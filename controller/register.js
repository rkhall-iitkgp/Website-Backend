const { User } = require("../model/User");
const bcrypt = require("bcryptjs");
const { UserSchema } = require("../types/register.ts")
exports.register = async (req, res) => {
	try {
		console.log(req.body);
		const reqBody = UserSchema.safeParse(req.body);
		if (!reqBody.success) {
			return Response.json(
				{
					code: -1,
					error: reqBody.error.issues,
					message: "Enter all required fields",
				},
				{ status: 400 }
			);
		}
		const user = User.findOne({ instiEmail: reqBody.instiEmail });
		if (user) {
			return res.status(400).json({
				code: -2,
				success: false,
				message: "User already exists",
			});
		}
		const newUser = new User(reqBody);

		bcrypt.hash(reqBody.password, 10, function (err, hash) {
			// Store hash in your password DB.
			newUser.password = hash;
			console.log("hashed password", hash);
			if (err) {
				console.log(err);
				return res.status(500).json({
					success: false,
					message: "Error in hashing password",
					code: -4,
				});
			}
		});
		await newUser.save();
		console.log("user registered successfully", newUser);

		res.status(200).json({
			success: true,
			message: "User registered successfully",
			code: 0,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			code: -1,
			success: false,
			error: e.message,
			message: "Internal Server Error",
		});
	}
};
