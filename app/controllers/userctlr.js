const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userCtlr = {};

userCtlr.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Errors: errors.array() });
    }
    try {
        const body = req.body;
        const newUser = new User(body);
        const salt = await bcryptjs.genSalt();
        const encryptPass = await bcryptjs.hash(newUser.password, salt);
        newUser.password = encryptPass;
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            newUser.role = "admin"
        } else {
            newUser.role = "customer"
        }
        await newUser.save();
        res.status(201).json(newUser);

    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server errors")
    }
}

userCtlr.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Errors: errors.array() });
    } try {
        const body = req.body;
        const user = await User.findOne({ email: body.email });
        if (!user) {
            return res.status(404).json({ Error: "invalid email and password" })
        }
        const checkPassword = await bcryptjs.compare(body.password, user.password)
        if (!checkPassword) {
            return res.status(404).json({ error: "invalid email and password" })
        }
        const tokenData = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "14d" });
        res.json({ token: token })
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server errors")
    }
}

userCtlr.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select({ password: 0 })
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" })

    }
}

userCtlr.createModerator = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { body } = req
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const encryptedpassword = await bcryptjs.hash(user.password, salt)
        user.password = encryptedpassword
        user.role = 'moderator'
        await user.save()
        res.status(201).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'internal server error' })
    }
}
module.exports = userCtlr;
