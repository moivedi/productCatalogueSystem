const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
    // console.log(req.headers);
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ Error: "Token is required" })
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("TokenData", token);
        req.user = {
            id: tokenData.id,
            role: tokenData.role
        }
        next();
    } catch (err) {
        // console.log(err);
        return res.status(401).json({ Error: err.message })
    }
}

const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({ error: 'you are not authorized to access' })
        }
    }
}

module.exports = {
    authenticateUser,
    authorizeUser
}