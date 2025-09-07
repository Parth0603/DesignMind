import { compressImage } from '../utils/imageUtils'

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const makeAPICall = async (payload, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        return response
      }

      if (response.status === 429 && i < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i + 1) * 1000))
        continue
      }

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a few minutes and try again.')
      }
      if (response.status === 403) {
        throw new Error('API access denied. Check your API key.')
      }
      if (response.status === 400) {
        throw new Error('Invalid request. Try a different message.')
      }
      throw new Error('Chat temporarily unavailable. Try again later.')
    } catch (error) {
      if (i === retries) throw error
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

export const aiDesignerChat = async (message, roomImage = null, chatHistory = []) => {
  try {
    const systemPrompt = `You are an interior designer. Give a brief 2-line answer to the user's question. Then add "\n\nPrompt: " followed by a complete, detailed room modification description under 450 characters that can be used directly for AI image generation. Include specific colors, materials, furniture styles, lighting, and spatial arrangements. Be comprehensive but concise.`

    const parts = [
      { text: `${systemPrompt}\n\nUser: ${message}` }
    ]

    if (roomImage) {
      const compressedImage = await compressImage(roomImage, 200, 0.2)
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: compressedImage.replace(/^data:image\/[a-z]+;base64,/, '')
        }
      })
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.7,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 400
      }
    }

    const response = await makeAPICall(payload)
    const data = await response.json()
    let reply = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (reply) {
      // Ensure the prompt part is under 500 characters
      if (reply.includes('Prompt:')) {
        const parts = reply.split('Prompt:')
        const answerPart = parts[0].trim()
        let promptPart = parts[1]?.trim() || ''
        
        if (promptPart.length > 450) {
          promptPart = promptPart.substring(0, 430).trim() + '...'
        }
        
        reply = answerPart + '\n\nPrompt: ' + promptPart
      }

      return reply
    }

    throw new Error('No response from AI chat')
  } catch (error) {
    console.error('AI Chat Error:', error)
    throw error
  }
}