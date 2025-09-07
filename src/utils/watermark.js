export const addWatermark = (imageUrl) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw original image
      ctx.drawImage(img, 0, 0)
      
      // Add visible watermark
      const fontSize = Math.max(24, img.width * 0.04)
      ctx.font = `bold ${fontSize}px Arial`
      
      const text = '🏠 HomeCanvas'
      const textWidth = ctx.measureText(text).width
      const x = img.width - textWidth - 20
      const y = img.height - 20
      
      // Add background for better visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(x - 10, y - fontSize - 5, textWidth + 20, fontSize + 15)
      
      // Add text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 2
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
      
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    
    img.src = imageUrl
  })
}

export const removeWatermark = (imageUrl) => {
  // Return original image without watermark for website downloads
  return imageUrl
}