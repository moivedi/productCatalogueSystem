const User = require("../models/userModel");
const registrationValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "username is required"
        },
        trim: true
    },
    email: {
        notEmpty: {
            errorMessage: "email is required"
        },
        trim: true,
        custom: {
            options: async function (value) {
                // console.log("value", value)
                const user = await User.findOne({ email: value });
                if (!user) {
                    return true;
                } else {
                    throw new Error("Email already exists");
                }
            }
        },
        isEmail: {
            errorMessage: "Email should be in valid format"
        },
        normalizeEmail: true
    },
    password: {
        notEmpty: {
            errorMessage: "password is required"
        },
        trim: true,
        isLength: {
            options: { min: 8, max: 120 },
            errorMessage: "Password should be 8 to 120 characters"
        }
    },
    role: {
        notEmpty: {
            errorMessage: "role is required"
        }, isIn: {
            options: [["admin", "moderator", "customer"]],
            errorMessage: "select role from given option"
        }
    }
}

const loginValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: "email is required"
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        notEmpty: {
            errorMessage: "password is required"
        },
        trim: true,
        isLength: {
            options: { min: 8, max: 120 },
            errorMessage: "Password should be 8 to 120 characters"
        }
    }
}

module.exports = {
    registrationValidationSchema,
    loginValidationSchema
}