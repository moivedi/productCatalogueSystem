const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type:String,
        default : "customer",
        enum : ["admin","customer","moderator"]

    }
}, { timestamps: true });

const user = model("User", userSchema);
module.exports = user;


