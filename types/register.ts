const { z } = require("zod");

const UserSchema = z.object({
	name: z.string({ required_error: "Name is required" }),
	rollNo: z.string({ required_error: "Roll Number is required" }),
	phoneNo: z.string({ required_error: "Phone Number is required" }),
	yearOfPassing: z
		.number({ required_error: "Year of passing is required" })
		.min(1960, "Year of passing should be greater than 1960"),
	personalEmail: z
		.string({ required_error: "Personal Email is required" })
		.email({ message: "Invalid email" }),
	instiEmail: z
		.string({ required_error: "Institute Email is required" })
		.email({ message: "Invalid email" }),
	dateOfBirth: z
		.string({ required_error: "Date of Birth is required" })
		.regex(
			/^\d{2}-\d{2}-\d{4}$/,
			"Invalid date format it should be dd-mm-yyyy"
		),
	department: z.string({ required_error: "Department is required" }),
	emergencyPhoneNo: z.string({
		required_error: "Emergency Phone Number is required",
	}),
	password: z
		.string({ required_error: "Password is required" })
		.min(8, "Password should be atleast 8 characters long"),
	role: z
		.string()
		.refine((value) => ["student", "admin", "alumnus"].includes(value), {
			message: "Invalid role",
			path: ["role"],
		})
		.default("student"),
});

exports.UserSchema = UserSchema;
