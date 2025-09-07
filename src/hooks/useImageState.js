import { useState, useCallback, useEffect } from 'react'
import { generateImage } from '../services/geminiAPI'
import { generateSpotEdit } from '../services/spotEditAPI'
import { validateImageFile, compressImage, convertToBase64, generateThumbnail } from '../utils/imageUtils'
import { analytics } from '../utils/analytics'
import { saveImageState, loadImageState, clearImageState } from '../utils/storage'

export const useHomeCanvas = () => {
  const [originalImage, setOriginalImage] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [imageHistory, setImageHistory] = useState([])
  const [editHistory, setEditHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadImageState()
    if (savedState) {
      setOriginalImage(savedState.originalImage)
      setCurrentImage(savedState.currentImage)
      setImageHistory(savedState.imageHistory || [])
      setEditHistory(savedState.editHistory || [])
    }
    setIsInitialized(true)
  }, [])

  // Save state whenever it changes
  useEffect(() => {
    if (isInitialized && (originalImage || currentImage)) {
      saveImageState({
        originalImage,
        currentImage,
        imageHistory,
        editHistory
      })
    }
  }, [originalImage, currentImage, imageHistory, editHistory, isInitialized])

  const uploadImage = useCallback(async (file) => {
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Convert to base64 directly
      setUploadProgress(25)
      const base64 = await convertToBase64(file)
      
      setUploadProgress(50)
      
      // Generate thumbnail
      setUploadProgress(75)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const thumbnail = await generateThumbnail(e.target.result)
        
        const imageData = {
          id: Date.now(),
          url: e.target.result,
          base64: base64,
          thumbnail: thumbnail,
          file: file,
          timestamp: new Date().toISOString(),
          isOriginal: true
        }
        
        setOriginalImage(imageData)
        setCurrentImage(imageData)
        setImageHistory([imageData])
        setEditHistory([])
        setUploadProgress(100)
        
        // Track successful upload
        analytics.trackImageUpload(file.size, file.type)
        
        setTimeout(() => {
          setUploadProgress(0)
          setIsLoading(false)
        }, 500)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      analytics.trackError(err, 'image_upload')
      setError('Failed to process image. Please try again.')
      setIsLoading(false)
      setUploadProgress(0)
    }
  }, [])

  const generateEdit = useCallback(async (prompt) => {
    if (!currentImage || !prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Convert current image to base64 if it's not already
      let imageBase64 = currentImage.base64
      if (!imageBase64 && currentImage.url.startsWith('data:')) {
        imageBase64 = currentImage.url.split(',')[1]
      }
      
      if (!imageBase64) {
        throw new Error('Unable to process image for API call')
      }

      // Call REAL API with progress updates
      const generatedImageUrl = await generateImage(imageBase64, prompt, (message) => {
        setLoadingMessage(message)
      })
      
      const thumbnail = await generateThumbnail(generatedImageUrl)
      const base64 = generatedImageUrl.split(',')[1]

      // Generate 10-word descriptive caption
      const generateCaption = (prompt) => {
        const words = prompt.toLowerCase().split(' ')
        const descriptiveWords = words.filter(word => 
          !['add', 'change', 'make', 'with', 'and', 'the', 'a', 'an', 'to', 'in', 'on', 'for'].includes(word)
        )
        const caption = descriptiveWords.slice(0, 10).join(' ')
        return caption.charAt(0).toUpperCase() + caption.slice(1)
      }

      const generatedImage = {
        id: Date.now(),
        url: generatedImageUrl,
        base64: base64,
        thumbnail: thumbnail,
        prompt: generateCaption(prompt),
        originalPrompt: prompt,
        timestamp: new Date().toISOString(),
        isGenerated: true,
        parentId: currentImage.id
      }

      // Add to history first, then update current
      setImageHistory(prev => {
        // Remove any images that come after the current image to maintain linear history
        const currentIndex = prev.findIndex(img => img.id === currentImage.id)
        const cleanHistory = currentIndex >= 0 ? prev.slice(currentIndex) : prev
        return [generatedImage, ...cleanHistory]
      })
      
      setEditHistory(prev => {
        // Clean edit history to match image history
        const newEdit = {
          id: Date.now() + 1,
          prompt: prompt,
          originalPrompt: prompt,
          timestamp: generatedImage.timestamp,
          fromImage: currentImage.id,
          toImage: generatedImage.id
        }
        return [...prev, newEdit]
      })
      
      setCurrentImage(generatedImage)
    } catch (err) {
      console.error('Image generation error:', err)
      analytics.trackError(err, 'image_generation')
      setError(err.message || 'Failed to generate design. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }, [currentImage])

  const selectImage = useCallback((image) => {
    if (!image) return
    
    setCurrentImage(image)
    setError(null)
    
    // Update edit history when selecting a different image
    if (image.id !== currentImage?.id) {
      // If selecting an image that's not the result of the last edit, update edit history
      const imageIndex = imageHistory.findIndex(img => img.id === image.id)
      if (imageIndex > 0) {
        // Trim edit history to match the selected image
        const relevantEdits = editHistory.filter(edit => {
          const editImageIndex = imageHistory.findIndex(img => img.id === edit.toImage)
          return editImageIndex >= imageIndex
        })
        setEditHistory(relevantEdits)
      }
    }
  }, [currentImage, imageHistory, editHistory])

  const undoLastEdit = useCallback(() => {
    if (imageHistory.length <= 1 || !currentImage) return
    
    // Find current image index
    const currentIndex = imageHistory.findIndex(img => img.id === currentImage.id)
    
    if (currentIndex >= 0 && currentIndex < imageHistory.length - 1) {
      // Get previous image (next in array since newest is first)
      const previousImage = imageHistory[currentIndex + 1]
      
      if (previousImage) {
        setCurrentImage(previousImage)
        // Remove current image from history
        setImageHistory(prev => prev.filter(img => img.id !== currentImage.id))
        // Remove corresponding edit
        setEditHistory(prev => prev.filter(edit => edit.toImage !== currentImage.id))
        setError(null)
      }
    }
  }, [imageHistory, currentImage])

  const resetToOriginal = useCallback(() => {
    if (originalImage) {
      setCurrentImage(originalImage)
      // Keep only the original image in history
      setImageHistory([originalImage])
      setEditHistory([])
      setError(null)
    }
  }, [originalImage])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const generateSpotEditCallback = useCallback(async ({ coordinates, prompt, zoneId }) => {
    if (!currentImage || !prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setLoadingMessage(`Editing spot at (${coordinates.x.toFixed(1)}%, ${coordinates.y.toFixed(1)}%)...`)

    try {
      let imageBase64 = currentImage.base64
      if (!imageBase64 && currentImage.url.startsWith('data:')) {
        imageBase64 = currentImage.url.split(',')[1]
      }
      
      if (!imageBase64) {
        throw new Error('Unable to process image for spot editing')
      }

      const result = await generateSpotEdit(imageBase64, coordinates, prompt)
      
      if (result.success) {
        const thumbnail = await generateThumbnail(result.imageUrl)
        const base64 = result.imageUrl.includes('base64,') ? result.imageUrl.split(',')[1] : null

        const editedImage = {
          id: Date.now(),
          url: result.imageUrl,
          base64: base64,
          thumbnail: thumbnail,
          prompt: `Spot edit: ${prompt}`,
          originalPrompt: prompt,
          coordinates: coordinates,
          zoneId: zoneId,
          timestamp: new Date().toISOString(),
          isGenerated: true,
          isSpotEdit: true,
          parentId: currentImage.id
        }

        setImageHistory(prev => {
          const currentIndex = prev.findIndex(img => img.id === currentImage.id)
          const cleanHistory = currentIndex >= 0 ? prev.slice(currentIndex) : prev
          return [editedImage, ...cleanHistory]
        })
        
        setEditHistory(prev => {
          const newEdit = {
            id: Date.now() + 1,
            prompt: prompt,
            originalPrompt: prompt,
            coordinates: coordinates,
            zoneId: zoneId,
            timestamp: editedImage.timestamp,
            fromImage: currentImage.id,
            toImage: editedImage.id,
            isSpotEdit: true
          }
          return [...prev, newEdit]
        })
        
        setCurrentImage(editedImage)
      }
    } catch (err) {
      console.error('Spot edit error:', err)
      setError(err.message || 'Failed to edit spot. Please try again.')
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }, [currentImage])

  const clearAll = useCallback(() => {
    setOriginalImage(null)
    setCurrentImage(null)
    setImageHistory([])
    setEditHistory([])
    setError(null)
    setUploadProgress(0)
    clearImageState()
  }, [])



  return {
    originalImage,
    currentImage,
    imageHistory,
    editHistory,
    isLoading,
    error,
    uploadProgress,
    loadingMessage,
    uploadImage,
    generateEdit,
    generateSpotEdit: generateSpotEditCallback,
    selectImage,
    undoLastEdit,
    resetToOriginal,
    clearError,
    clearAll,
    canUndo: imageHistory.length > 1 && currentImage && !currentImage.isOriginal,
    canReset: originalImage && currentImage?.id !== originalImage.id
  }
}

// Keep the old hook name for backward compatibility
export const useImageState = useHomeCanvas