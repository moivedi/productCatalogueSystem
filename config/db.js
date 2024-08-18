const mongoose = require("mongoose");
const ConfigureDb = async () => {
    const Db = await mongoose.connect("mongodb://127.0.0.1:27017/product-catelog-system-2024");
    try {
        console.log("connected to db");
    } catch (err) {
        console.log("Error connected to db");
    }
};
module.exports = ConfigureDb;

