const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const productSchema = new Schema({
    name: String,
    price: String,
    description: String,
    isApprove: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        // required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    image : {
        type : String
    }
}, { timestamps: true });
const product = model("Product", productSchema);
module.exports = product;