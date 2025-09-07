const express = require('express');
const multer = require('multer');
const { generateDesign, analyzeRoom, editSpot } = require('../controllers/imageController');
const { validateImage } = require('../middleware/validation');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

router.post('/generate', upload.single('image'), validateImage, generateDesign);
router.post('/analyze', upload.single('image'), validateImage, analyzeRoom);
router.post('/edit-spot', upload.single('image'), validateImage, editSpot);

module.exports = router;