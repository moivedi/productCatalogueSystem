require("dotenv").config();
const express = require("express");
const { checkSchema } = require("express-validator");
const app = express();
const cors = require("cors");
const port = process.env.port || 3071;
const multer = require('multer');

app.use(express.json());
app.use(cors());
const ConfigDb = require("./config/db");
const { registrationValidationSchema, loginValidationSchema } = require("./app/validation/userValidation");
const productSchemaValidation = require("./app/validation/productValidation");
const userCtlr = require("./app/controllers/userctlr");
const productCtlr = require("./app/controllers/productCtlr");
const { authenticateUser, authorizeUser } = require("./app/middleware/auth");
const product = require("./app/models/productModel");
ConfigDb();

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storageConfig });

app.post("/api/user/register", checkSchema(registrationValidationSchema), userCtlr.register);
app.post("/api/user/login", checkSchema(loginValidationSchema), userCtlr.login);
app.get("/api/user/account", authenticateUser, userCtlr.account);
app.post("/api/user/createModerator", authenticateUser, authorizeUser(["admin"]), checkSchema(registrationValidationSchema), userCtlr.createModerator);

//to create product (admin and moderator)
app.post("/api/product", authenticateUser, authorizeUser(["admin", "moderator"]), upload.single("image"), checkSchema(productSchemaValidation), productCtlr.create);
// to view all the products to moderator and admin
app.get("/api/products", authenticateUser, authorizeUser(["admin", "moderator"]), productCtlr.list);
//to view all the approved products
app.get("/api/products/customer", authenticateUser, productCtlr.approvedList);
//to view all the pending approval products
app.get("/api/products/pending", authenticateUser, authorizeUser(["admin"]), productCtlr.pendingList);
//to update (for admin and moderator)*
app.put("/api/products/update/:id", authenticateUser, authorizeUser(["admin", "moderator"]),upload.single("image"), productCtlr.update);
//to update product active status*
app.put("/api/activeProduct/:id", authenticateUser, authorizeUser(["admin"]), productCtlr.activeStatus);
// to soft delete for admin (is deleted)
app.delete("/api/softProducts/:id", authenticateUser, authorizeUser(["admin"]), productCtlr.softDelete);
//to hard delete (for admin)*
app.delete("/api/hardProducts/:id", authenticateUser, authorizeUser(["admin"]), productCtlr.hardDelete);
//to restore only by admin
app.put("/api/product/restore/:id", authenticateUser, authorizeUser(["admin"]), productCtlr.restore);
//to approve the product by admin 
app.put("/api/approveProduct/:id", authenticateUser, authorizeUser(["admin"]), productCtlr.approveStatus);

app.get("/image", (req, res) => {
    res.sendFile(__dirname + "/" + req.query.imgPath);
});

// app.post("/upload-file", upload.single('image'), (req, res) => {
//     console.log(req.file)
//     res.json(true)
// })




app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
