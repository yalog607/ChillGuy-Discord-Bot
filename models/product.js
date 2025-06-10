const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }

}, {
    timestamps: {
        createdAt: true,
  }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;