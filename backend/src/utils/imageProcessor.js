const sharp = require('sharp');

const processImage = async (imageBuffer) => {
  try {
    // Optimize image: resize if too large, compress, convert to JPEG
    const processedBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

const getImageMetadata = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    console.error('Metadata extraction error:', error);
    throw new Error('Failed to extract image metadata');
  }
};

module.exports = { processImage, getImageMetadata };