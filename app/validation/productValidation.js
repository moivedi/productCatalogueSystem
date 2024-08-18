const productSchemaValidation = {
    name: {
        notEmpty: {
            errorMessage: "product Name is required"
        },
        trim: true
    },
    price: {
        notEmpty: {
            errorMessage: "price is required"
        },
        trim: true,
        isFloat: {
            options: { min: 0 },
            errorMessage: "Price must be a positive number"
        }
    },
    description: {
        notEmpty: {
            errorMessage: "product description is required"
        }
    },
    isApprove: {
        isIn: {
            options: ["pending", "approved", "rejected"],
            errorMessage: "approve status is required"
        }
    }
}

module.exports = productSchemaValidation;