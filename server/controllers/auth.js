const mongoose = require('mongoose')
const { User } = require('../models/user.models')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')


const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ message: "all fields are required" });
            return;
        }
        // Convert the email to lowercase for case-insensitive comparison
        const lowercaseEmail = email.toLowerCase();

        const userAvailable = await User.findOne({ email: lowercaseEmail, username: username });

        if (userAvailable) {
            res.status(400).json({ message: "user already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email: lowercaseEmail,
            password: hashedPassword,

        });
        res.json({
            message: 'Registration successful',
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});


const loginUser = asyncHandler(async (req, res) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "all fileds are required" })
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({ message: `user with ${email} does not exist` })
        }



        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({
                id: user._id,
                username: user.username,
                email: user.email,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.status(200).json({ token: accessToken, message: "User logged in", user: user });
        } else {
            res.status(401).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});



module.exports = {
    registerUser,
    loginUser
}