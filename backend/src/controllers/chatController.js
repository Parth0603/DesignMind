const { geminiService } = require('../services/geminiService');

const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const response = await geminiService.chatResponse(message, context);
    
    res.json({
      success: true,
      data: {
        response: response.text,
        suggestions: response.suggestions || []
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

module.exports = { chatWithAI };