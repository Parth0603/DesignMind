// Basic analytics tracking for demo purposes
class Analytics {
  constructor() {
    this.events = []
    this.sessionId = Date.now().toString()
  }

  track(event, properties = {}) {
    const eventData = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    }

    this.events.push(eventData)
    
    // In production, send to analytics service
    if (import.meta.env.VITE_APP_ENV === 'production') {
      console.log('Analytics Event:', eventData)
    }
  }

  // Track specific HomeCanvas events
  trackImageUpload(fileSize, fileType) {
    this.track('image_uploaded', {
      file_size: fileSize,
      file_type: fileType
    })
  }

  trackGeneration(prompt, processingTime) {
    this.track('design_generated', {
      prompt_length: prompt.length,
      processing_time: processingTime
    })
  }

  trackError(error, context) {
    this.track('error_occurred', {
      error_message: error.message,
      error_context: context,
      stack_trace: error.stack
    })
  }

  trackPageView(page) {
    this.track('page_viewed', {
      page_name: page
    })
  }

  getSessionStats() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      events: this.events
    }
  }
}

export const analytics = new Analytics()

// Helper function to track performance
export const trackPerformance = (name, fn) => {
  return async (...args) => {
    const startTime = performance.now()
    try {
      const result = await fn(...args)
      const endTime = performance.now()
      analytics.track('performance_metric', {
        metric_name: name,
        duration: endTime - startTime,
        success: true
      })
      return result
    } catch (error) {
      const endTime = performance.now()
      analytics.track('performance_metric', {
        metric_name: name,
        duration: endTime - startTime,
        success: false,
        error: error.message
      })
      throw error
    }
  }
}