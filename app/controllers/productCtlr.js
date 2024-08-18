const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const _ = require("lodash");
const productCtlr = {};

productCtlr.create = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Errors: errors.array() });
    }
    try {
        const body = req.body;
        const product = new Product(body);
        if (req.file) {
            product.image = req.file.path;
        }
        if (req.user.role === "admin") {
            product.isApprove = "approved"
            await product.save();
            res.status(201).json(product);
        } else if (req.user.role === "moderator") {
            product.isApprove = "pending";
            await product.save();
            res.status(201).json(product);
        }
        else {
            res.status(403).json({ Error: "you are not authorised person" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
}

productCtlr.list = async (req, res) => {
    try {
        const products = await Product.find()
        if (req.user.role !== "customer") {
            res.json(products);
        } else {
            res.json({ Error: "you are not authorised to view all the products" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.approvedList = async (req, res) => {
    try {
        const products = await Product.find({ isApprove: "approved" })
        return res.json(products)
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.pendingList = async (req, res) => {
    try {
        const products = await Product.find({ isApprove: "pending" });
        return res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.update = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if (req.body.isApprove) {
            res.json("you cannot approve product")
        } else {
            res.json(updatedProduct);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.activeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndUpdate(id, { isActive: req.body.isActive }, { new: true });
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.softDelete = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.hardDelete = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        if (product.isApprove = "rejected") {
            res.json(product);
        } else {
            res.json(product);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.restore = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findByIdAndUpdate(id, { isDeleted: false }, { new: true })
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

productCtlr.approveStatus = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(id, { isApprove: req.body.isApprove }, { new: true })
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}


module.exports = productCtlr;