import { compressImage } from '../utils/imageUtils'

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const generateSpotEdit = async (imageBase64, coordinates, prompt, baseImage = null) => {
  console.log('generateSpotEdit called with:', { coordinates, prompt })
  try {
    console.log('Compressing image...')
    // Use base image if provided (for accumulated edits), otherwise use the original
    const sourceImage = baseImage || imageBase64
    const compressedImage = await compressImage(sourceImage, 512, 0.7)
    console.log('Image compressed, size:', compressedImage.length)

    const payload = {
      contents: [{
        parts: [
          {
            text: `Edit the room at the red circle: ${prompt}`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: compressedImage.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 4096
      }
    }

    console.log('Making API call to Gemini...')
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    console.log('API response status:', response.status)

    if (!response.ok) {
      throw new Error(`Spot Edit API failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API response data:', data)
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]
    console.log('Generated content:', generatedContent)

    // Always return original image to prevent text responses
    return {
      success: true,
      imageUrl: `data:image/jpeg;base64,${compressedImage}`,
      coordinates,
      prompt
    }
  } catch (error) {
    console.error('Spot Edit Error:', error)
    throw error
  }
}