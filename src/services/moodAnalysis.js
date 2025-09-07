import { compressImage } from '../utils/imageUtils'

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const analyzeMood = async (roomImageBase64, desiredMood) => {
  try {
    const compressedImage = await compressImage(roomImageBase64, 200, 0.2)

    const payload = {
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: compressedImage.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          },
          {
            text: `Analyze this room and suggest specific interior design changes to create a "${desiredMood}" ambiance. Consider:
            1. Current mood/atmosphere of the room
            2. Color palette changes needed
            3. Lighting adjustments
            4. Furniture modifications
            5. Decor additions/removals
            6. Texture and material suggestions

            Provide actionable, specific recommendations in a structured format.`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 1500
      }
    }

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Mood Analysis API failed: ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (analysis) {
      return {
        currentMood: extractSection(analysis, 'current'),
        suggestions: extractSection(analysis, 'suggestions'),
        colorPalette: extractSection(analysis, 'color'),
        lighting: extractSection(analysis, 'lighting'),
        furniture: extractSection(analysis, 'furniture'),
        fullAnalysis: analysis
      }
    }

    throw new Error('No mood analysis generated')
  } catch (error) {
    console.error('Mood Analysis Error:', error)
    throw error
  }
}

const extractSection = (text, keyword) => {
  const lines = text.split('\n')
  const relevantLines = lines.filter(line =>
    line.toLowerCase().includes(keyword) ||
    line.includes('•') ||
    line.includes('-')
  )
  return relevantLines.slice(0, 3).join('\n')
}

export const MOOD_OPTIONS = [
  { value: 'cozy', label: '🔥 Cozy & Warm', description: 'Comfortable, intimate atmosphere' },
  { value: 'modern', label: '✨ Modern & Sleek', description: 'Clean, minimalist design' },
  { value: 'rustic', label: '🌿 Rustic & Natural', description: 'Earthy, organic materials' },
  { value: 'luxurious', label: '💎 Luxurious & Elegant', description: 'High-end, sophisticated' },
  { value: 'energetic', label: '⚡ Energetic & Vibrant', description: 'Bold colors, dynamic feel' },
  { value: 'peaceful', label: '🧘 Peaceful & Zen', description: 'Calm, meditative space' },
  { value: 'romantic', label: '💕 Romantic & Intimate', description: 'Soft, dreamy atmosphere' },
  { value: 'industrial', label: '🏭 Industrial & Urban', description: 'Raw materials, urban edge' }
]