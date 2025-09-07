// Simple localStorage wrapper for persisting image state
const STORAGE_KEY = 'homecanvas_state'

export const saveImageState = (state) => {
  try {
    if (!state) return
    const stateToSave = {
      originalImage: state.originalImage || null,
      currentImage: state.currentImage || null,
      imageHistory: state.imageHistory || [],
      editHistory: state.editHistory || [],
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
  } catch (error) {
    console.warn('Failed to save state:', error)
  }
}

export const loadImageState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const state = JSON.parse(saved)
      // Only load if saved within last hour and has valid data
      if (state && state.timestamp && Date.now() - state.timestamp < 3600000) {
        return {
          originalImage: state.originalImage || null,
          currentImage: state.currentImage || null,
          imageHistory: state.imageHistory || [],
          editHistory: state.editHistory || []
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load state:', error)
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Failed to clear corrupted state:', e)
    }
  }
  return null
}

export const clearImageState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear state:', error)
  }
}