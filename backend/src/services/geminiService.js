const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateDesign(imageBuffer, prompt) {
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const fullPrompt = `As an expert interior designer, analyze this room image and ${prompt}. 
      Provide detailed suggestions for improvements, color schemes, furniture placement, and styling tips.
      Focus on practical and achievable changes.`;

      const result = await this.model.generateContent([fullPrompt, imagePart]);
      const response = await result.response;
      
      return {
        description: response.text(),
        suggestions: this.extractSuggestions(response.text()),
        imageUrl: null // Placeholder for actual image generation
      };
    } catch (error) {
      console.error('Gemini generate design error:', error);
      throw error;
    }
  }

  async analyzeRoom(imageBuffer) {
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const prompt = `Analyze this room image and provide:
      1. Room type identification
      2. Current style assessment
      3. Color palette analysis
      4. Furniture and decor evaluation
      5. Lighting assessment
      6. Space utilization review
      Format as JSON with clear categories.`;

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      
      return this.parseAnalysis(response.text());
    } catch (error) {
      console.error('Gemini analyze room error:', error);
      throw error;
    }
  }

  async editSpot(imageBuffer, coordinates, prompt) {
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const fullPrompt = `Focus on the area at coordinates (${coordinates.x}, ${coordinates.y}) in this room image. 
      ${prompt}. Provide specific suggestions for this particular area or object.`;

      const result = await this.model.generateContent([fullPrompt, imagePart]);
      const response = await result.response;
      
      return {
        suggestions: response.text(),
        coordinates,
        editedImageUrl: null // Placeholder for actual image editing
      };
    } catch (error) {
      console.error('Gemini edit spot error:', error);
      throw error;
    }
  }

  async chatResponse(message, context = '') {
    try {
      const prompt = `You are an expert interior designer assistant. 
      Context: ${context}
      User message: ${message}
      
      Provide helpful, practical interior design advice. Be conversational and encouraging.`;

      const result = await this.textModel.generateContent(prompt);
      const response = await result.response;
      
      return {
        text: response.text(),
        suggestions: this.extractSuggestions(response.text())
      };
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw error;
    }
  }

  extractSuggestions(text) {
    // Extract bullet points or numbered suggestions from response
    const suggestions = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^[\d\-\*•]/)) {
        suggestions.push(line.replace(/^[\d\-\*•]\s*/, '').trim());
      }
    });
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  parseAnalysis(text) {
    try {
      // Try to parse as JSON first
      return JSON.parse(text);
    } catch {
      // Fallback to structured text parsing
      return {
        roomType: 'Unknown',
        style: 'Mixed',
        colors: ['Neutral tones'],
        furniture: 'Various pieces',
        lighting: 'Standard lighting',
        spaceUtilization: 'Moderate',
        rawAnalysis: text
      };
    }
  }
}

const geminiService = new GeminiService();
module.exports = { geminiService };