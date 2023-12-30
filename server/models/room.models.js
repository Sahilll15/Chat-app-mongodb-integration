const mongoose = require('mongoose')

const RoomModel = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    roomUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true })

const Room = mongoose.model('Room', RoomModel)
module.exports = { Room, RoomModel }
