const mongoose = require('mongoose');
const { User } = require('../models/user.models');
const { Message } = require('../models/messages.models');
const { Room } = require('../models/room.models');
const crypto = require('crypto');

const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;




const createMessage = async (req, res) => {
    const { message } = req.body;
    const { roomId } = req.params;

    try {
        const user = req.user.id;
        const userExists = await User.findById(user);

        if (!userExists) {
            res.status(400).json({ message: "User does not exist" });
        }

        const roomExists = await Room.findById(roomId);

        if (!roomExists) {
            res.status(400).json({ message: "Room does not exist" });
        }



        const newMessage = await Message.create({
            message: message,
            sender: user,
            room: roomId
        });

        res.json({ message: 'Message created successfully', newMessage });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const fetchMessages = async (req, res) => {
    const { roomId } = req.params;

    try {
        const roomExists = await Room.findById(roomId);

        if (!roomExists) {
            res.status(400).json({ message: "Room does not exist" });
        }

        const messages = await Message.find({ room: roomId }).populate('sender', 'username');

        // Decrypt each message before sending it in the response
        // const decryptedMessages = messages.map((msg) => {
        //     return {
        //         _id: msg._id,
        //         message: decrypt(msg.message),
        //         sender: msg.sender,
        //         room: msg.room,
        //         createdAt: msg.createdAt,
        //         updatedAt: msg.updatedAt
        //     };
        // });

        res.json({ message: 'Messages fetched successfully', messages: messages });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMessage,
    fetchMessages
};
