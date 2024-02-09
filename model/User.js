const { Schema, models, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    rollNo: {
        type: String,
        required:true,
    },
    phoneNo: {
        type: String,
        required:true,
    },
    yearOfPassing: {
        type: Number,
        required: true,
    },
    personalEmail: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already registered"]
    },
    instiEmail: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already registered"] 
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    emergencyPhoneNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    // role: {
    //     type: String,
    //     required: true,
    //     enum: ["student", "admin", "alumnus"],
    //     default: "student"
    // }
}, {
    virtuals: {
        id: {
            get() {
                return this._id
            }
        }
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id
            return ret
        }
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id
            return ret
        }
    }
})

exports.User = models.user || model("user", userSchema)