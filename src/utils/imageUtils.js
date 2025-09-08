export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 2 * 1024 * 1024 // 2MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 2MB' }
  }

  return { valid: true }
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const compressImage = (input, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    
    // Handle both File objects and base64 strings
    if (typeof input === 'string') {
      img.src = input.startsWith('data:') ? input : `data:image/jpeg;base64,${input}`
    } else {
      img.src = URL.createObjectURL(input)
    }
  })
}

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const generateThumbnail = (imageUrl, size = 150) => {
  return new Promise((resolve) => {
    // For external URLs, just return the original URL
    if (imageUrl.startsWith('http')) {
      resolve(imageUrl)
      return
    }
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      try {
        canvas.width = size
        canvas.height = size
        
        const scale = Math.max(size / img.width, size / img.height)
        const x = (size - img.width * scale) / 2
        const y = (size - img.height * scale) / 2
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      } catch (error) {
        console.warn('Thumbnail generation failed:', error)
        resolve(imageUrl) // Return original if thumbnail fails
      }
    }
    
    img.onerror = () => resolve(imageUrl)
    img.src = imageUrl
  })
}

export const downloadImage = (imageUrl, filename = 'homecanvas-design.jpg') => {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}