// Configuration constants only - no demo content

// Example prompts for user guidance
export const EXAMPLE_PROMPTS = [
  'Replace the sofa with a modern sectional in navy blue',
  'Change the coffee table to a glass-top design',
  'Add a large plant in the corner',
  'Replace the curtains with white blinds',
  'Change the wall color to sage green',
  'Add a bookshelf against the wall'
]

// API configuration
export const API_CONFIG = {
  BACKEND_URL: 'http://localhost:5000',
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  MAX_RETRIES: 3,
  TIMEOUT: 30000
}

// Image processing settings
export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  COMPRESSION_QUALITY: 0.8,
  MAX_WIDTH: 1024,
  THUMBNAIL_SIZE: 150,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// UI constants
export const UI_CONFIG = {
  PROMPT_MAX_LENGTH: 500,
  PROMPT_MIN_LENGTH: 10,
  HISTORY_MAX_ITEMS: 10,
  ANIMATION_DURATION: 300
}