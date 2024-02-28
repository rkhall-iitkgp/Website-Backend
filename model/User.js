const { Schema, models, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		rollNo: {
			type: String,
			required: [true, "Roll number is required"],
		},
		phoneNo: {
			type: String,
			required: [true, "Phone number is required"],
		},
		yearOfPassing: {
			type: Number,
			required: [true, "Year of passing is required"],
			min: [1960, "Year of passing is not a valid number"],
			max: [],
		},
		personalEmail: {
			type: String,
			required: [true, "Personal email is required"],
			unique: [true, "This email is already registered"],
			validate: {
				validator: function (v) {
					// Regular expression for email validation
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email address!`,
			},
		},
		instiEmail: {
			type: String,
			unique: [true, "This email is already registered"],
			validate: {
				validator: function (v) {
					// Regular expression for email validation
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email address!`,
			},
		},
		dateOfBirth: {
			type: String,
			required: [true, "Date of birth is required"],
			validate: {
				validator: function (v) {
					// Regular expression for email validation
					return /^\d{2}-\d{2}-\d{4}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid date!`,
			},
		},
		department: {
			type: String,
			required: [true, "Department is required"],
		},
		emergencyPhoneNo: {
			type: String,
			required: [true, "Emergency phone number is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
		},
		role: {
			type: String,
			required: [true, "Role is required"],
			enum: ["student", "admin", "alumnus"],
			default: "student",
		},
		experience: [
			{
				Title: String,
				startTime: Date,
				endTime: Date,
				description: String,
				location: String,
				position: String,
			},
		],
		involvements: [
			{
				Title: String,
				startTime: Date,
				endTime: Date,
				description: String,
				position: String,
			},
		],
		profilePic: {
			type: String,
		},
		resume: {
			type: String,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		virtuals: {
			id: {
				get() {
					return this._id;
				},
			},
		},
		toObject: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret) => {
				delete ret._id;
				return ret;
			},
		},
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret) => {
				delete ret._id;
				return ret;
			},
		},
	}
);

userSchema.plugin(uniqueValidator, {
	message: "This {PATH} is already registered",
});

exports.User = models.user || model("user", userSchema);
