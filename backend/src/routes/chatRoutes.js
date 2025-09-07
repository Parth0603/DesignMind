const express = require('express');
const { chatWithAI } = require('../controllers/chatController');
const { validateChatInput } = require('../middleware/validation');

const router = express.Router();

router.post('/message', validateChatInput, chatWithAI);

module.exports = router;