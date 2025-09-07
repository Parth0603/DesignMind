import { analytics, trackPerformance } from '../utils/analytics'
import { addWatermark } from '../utils/watermark'

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const GEMINI_IMAGE_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Enhanced prompt generation using Gemini
const enhancePrompt = async (originalPrompt, imageBase64) => {
  const payload = {
    contents: [{
      parts: [
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: imageBase64
          }
        },
        {
          text: `Analyze this room image and enhance this interior design request: "${originalPrompt}". Create a detailed, professional interior design prompt that includes specific details about colors, materials, lighting, furniture styles, and spatial arrangements. Make it suitable for AI image generation. Keep it under 200 words but very descriptive.`
        }
      ]
    }],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 300
    }
  }

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) throw new Error(`Prompt enhancement failed: ${response.status}`)
  
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || originalPrompt
}

// Generate image modification using Gemini 2.5 Flash Image Preview with user's image
const generateImageFromPrompt = async (enhancedPrompt, originalImageBase64) => {
  try {
    const payload = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: originalImageBase64
            }
          },
          {
            text: `Looking at this room image, please generate a modified version where: ${enhancedPrompt}. IMPORTANT: Keep the exact same room layout, walls, windows, and overall architecture. Only modify the specific elements mentioned in the request. Maintain the same perspective, lighting, and room structure. The result should look like the same room with only the requested changes applied.`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 8192
      }
    }

    const response = await fetch(`${GEMINI_IMAGE_API}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Gemini Image API failed: ${response.status}`)
    }

    const data = await response.json()
    
    // Check for generated image in response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`
        }
      }
    }
    
    throw new Error('No image generated from Gemini API')
  } catch (error) {
    console.warn('Gemini Image generation failed:', error)
    throw error
  }
}

export const generateImage = trackPerformance('gemini_generate_image', async (imageBase64, prompt, onProgress) => {
  const startTime = Date.now()
  
  try {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.')
    }

    analytics.track('api_call_started', {
      api_function: 'generateImage',
      prompt_length: prompt.length
    })

    // Step 1: Enhance prompt with Gemini
    if (onProgress) onProgress('🧠 Analyzing your room with AI...')
    
    let enhancedPrompt
    try {
      enhancedPrompt = await enhancePrompt(prompt, imageBase64)
    } catch (error) {
      console.warn('Prompt enhancement failed, using original:', error)
      enhancedPrompt = prompt
    }
    
    // Step 2: Generate real image with Gemini Imagen
    if (onProgress) onProgress('🎨 Generating your room design...')
    
    const imageUrl = await generateImageFromPrompt(enhancedPrompt, imageBase64)
    
    if (onProgress) onProgress('🏷️ Adding watermark...')
    
    if (onProgress) onProgress('✨ Design complete!')
    
    analytics.trackGeneration(prompt, Date.now() - startTime)
    return imageUrl
  } catch (error) {
    console.error('Generation Error:', error)
    analytics.trackError(error, 'generateImage')
    throw new Error('Failed to generate design. Please try again.')
  }
})

// Legacy exports for backward compatibility
export const replaceObject = generateImage
export const editScene = generateImage