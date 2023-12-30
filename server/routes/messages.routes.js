const { createMessage, fetchMessages } = require('../controllers/message')
const express = require('express')
const router = express.Router()

const { validateToken } = require('../middlewares/verify.middleware')

router.post('/create/:roomId', validateToken, createMessage)
router.get('/getMessages/:roomId', fetchMessages)

module.exports = router