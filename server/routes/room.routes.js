
const express = require('express')
const router = express.Router()
const {
    createRoom,
    getRooms,
    getRoom,
    joinRoom,
    getRoomsJoinedByUser
} = require('../controllers/room')
const { validateToken } = require('../middlewares/verify.middleware')



router.post('/create', createRoom)
router.get('/', getRooms)
router.get('/:id', getRoom)
router.post('/join/:roomId', validateToken, joinRoom)
router.get('/user/joined', validateToken, getRoomsJoinedByUser)


module.exports = router