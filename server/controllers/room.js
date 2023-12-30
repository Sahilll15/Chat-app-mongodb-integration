const mongoose = require('mongoose')
const { Room, RoomModel } = require('../models/room.models')
const { User } = require('../models/user.models')

const createRoom = async (req, res) => {
    try {
        const { roomName } = req.body
        if (!roomName) {
            res.status(400).json({ message: 'room name is required' })
            return
        }
        const room = await Room.findOne({ roomName })
        if (room) {
            res.status(400).json({ message: 'room already exists' })
            return
        }
        const newRoom = await Room.create({ roomName })

        res.json({ message: 'room created successfully', newRoom })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({})
        res.json({ message: 'rooms fetched successfully', rooms })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getRoom = async (req, res) => {
    try {
        const { id } = req.params
        const room = await Room.findById(id)
        res.json({ message: 'room fetched successfully', room })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const joinRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const user = req.user.id;

        const userExist = await User.findById(user);

        if (!userExist) {
            res.status(400).json({ message: "user does not exist" })
        }

        const roomExist = await Room.findById(roomId);

        if (!roomExist) {
            res.status(400).json({ message: "room does not exist" })
        }

        const userInRoom = roomExist.roomUsers.find((user) =>
            user.toString() === userExist._id.toString()
        );
        console.log(userInRoom)

        if (userInRoom) {
            res.status(400).json({ message: "user already in room" })
        }

        roomExist.roomUsers.push(userExist._id);

        await roomExist.save();

        res.json({ message: "user joined room successfully" })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getRoomsJoinedByUser = async (req, res) => {
    try {
        const rooms = await Room.find({ roomUsers: req.user.id })
        res.json({ message: 'rooms fetched successfully', rooms })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    createRoom,
    getRooms,
    getRoom,
    joinRoom,
    getRoomsJoinedByUser
}