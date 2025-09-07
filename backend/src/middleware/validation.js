const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP allowed' });
  }

  if (req.file.size > 10 * 1024 * 1024) { // 10MB
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
  }

  next();
};

const validateChatInput = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long. Maximum 1000 characters' });
  }

  next();
};

module.exports = { validateImage, validateChatInput };