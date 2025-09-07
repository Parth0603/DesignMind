const { geminiService } = require('../services/geminiService');
const { processImage } = require('../utils/imageProcessor');

const generateDesign = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageBuffer = req.file.buffer;

    const processedImage = await processImage(imageBuffer);
    const result = await geminiService.generateDesign(processedImage, prompt);

    res.json({
      success: true,
      data: {
        generatedImage: result.imageUrl,
        description: result.description,
        suggestions: result.suggestions
      }
    });
  } catch (error) {
    console.error('Generate design error:', error);
    res.status(500).json({ error: 'Failed to generate design' });
  }
};

const analyzeRoom = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const processedImage = await processImage(imageBuffer);
    const analysis = await geminiService.analyzeRoom(processedImage);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Room analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze room' });
  }
};

const editSpot = async (req, res) => {
  try {
    const { coordinates, prompt } = req.body;
    const imageBuffer = req.file.buffer;

    const processedImage = await processImage(imageBuffer);
    const result = await geminiService.editSpot(processedImage, coordinates, prompt);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Spot edit error:', error);
    res.status(500).json({ error: 'Failed to edit spot' });
  }
};

module.exports = { generateDesign, analyzeRoom, editSpot };