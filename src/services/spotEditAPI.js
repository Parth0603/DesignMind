import { compressImage } from '../utils/imageUtils'

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const generateSpotEdit = async (imageBase64, coordinates, prompt) => {
  console.log('generateSpotEdit called with:', { coordinates, prompt })
  try {
    console.log('Compressing image...')
    const compressedImage = await compressImage(imageBase64, 512, 0.8)
    console.log('Image compressed, size:', compressedImage.length)

    const payload = {
      contents: [{
        parts: [
          {
            text: `Edit this room image by focusing on the area at coordinates (${coordinates.x.toFixed(1)}%, ${coordinates.y.toFixed(1)}%). Apply this change: "${prompt}". Keep the edit natural and maintain the room's style.`
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
        topK: 20,
        topP: 0.8
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

    if (generatedContent?.inlineData?.data) {
      const imageUrl = `data:image/jpeg;base64,${generatedContent.inlineData.data}`
      console.log('Generated image URL length:', imageUrl.length)
      return {
        success: true,
        imageUrl,
        coordinates,
        prompt
      }
    }

    console.log('No image data in response')
    throw new Error('No spot edit result generated')
  } catch (error) {
    console.error('Spot Edit Error:', error)
    throw error
  }
}