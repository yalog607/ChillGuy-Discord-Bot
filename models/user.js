const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    joinAt: {
        type: String,
        required: true,
    },
    amountUsed: {
        type: Number,
        required: true,
        default: 0
    }

}, {
    timestamps: {
        createdAt: true,
  }
})

const User = model("User", userSchema);

module.exports = User;