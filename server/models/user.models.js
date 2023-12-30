const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Please provide a email"],
            unique: [true, "This email is already in use"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
            },
        ]
    },
    { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = { User, userSchema };