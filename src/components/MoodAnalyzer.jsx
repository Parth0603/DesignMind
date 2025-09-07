import { useState } from 'react'
import PropTypes from 'prop-types'
import { analyzeMood, MOOD_OPTIONS } from '../services/moodAnalysis'

const MoodAnalyzer = ({ roomImage, onMoodAnalysis, className = '' }) => {
  const [selectedMood, setSelectedMood] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyzeMood = async () => {
    if (!selectedMood || !roomImage) return

    setIsLoading(true)
    try {
      const result = await analyzeMood(roomImage, selectedMood)
      
      const cleanResult = {
        ...result,
        suggestions: result.suggestions?.replace(/\*/g, ''),
        fullAnalysis: result.fullAnalysis?.replace(/\*/g, ''),
        colorPalette: result.colorPalette?.replace(/\*/g, ''),
        lighting: result.lighting?.replace(/\*/g, '')
      }
      
      setAnalysis(cleanResult)
      if (onMoodAnalysis) {
        onMoodAnalysis(cleanResult)
      }
    } catch (error) {
      console.error('Mood analysis failed:', error)
      setAnalysis({ error: 'Failed to analyze mood. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`mood-analyzer ${className}`}>
      <div className="mood-header">
        <h3>🎨 Room Mood Analysis</h3>
        <p>Select your desired ambiance and get AI suggestions</p>
      </div>

      <div className="mood-selector">
        <label>Choose your desired mood:</label>
        <div className="mood-grid">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.value}
              className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood.value)}
              disabled={isLoading}
            >
              <div className="mood-label">{mood.label}</div>
              <div className="mood-description">{mood.description}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAnalyzeMood}
        disabled={!selectedMood || !roomImage || isLoading}
        className="btn btn-primary analyze-btn"
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Analyzing Mood...
          </>
        ) : (
          '🔍 Analyze Room Mood'
        )}
      </button>

      {analysis && (
        <div className="mood-results">
          {analysis.error ? (
            <div className="error-message">{analysis.error}</div>
          ) : (
            <div className="analysis-content">
              <h4>💡 AI Mood Analysis Results</h4>
              
              <div className="analysis-section">
                <h5>🎯 Recommendations for "{selectedMood}" mood:</h5>
                <div className="analysis-text">
                  {analysis.suggestions || analysis.fullAnalysis}
                </div>
              </div>

              {analysis.colorPalette && (
                <div className="analysis-section">
                  <h5>🎨 Color Palette:</h5>
                  <div className="analysis-text">{analysis.colorPalette}</div>
                </div>
              )}

              {analysis.lighting && (
                <div className="analysis-section">
                  <h5>💡 Lighting:</h5>
                  <div className="analysis-text">{analysis.lighting}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        .mood-analyzer {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .mood-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .mood-header h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .mood-header p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .mood-selector {
          margin-bottom: 1.5rem;
        }

        .mood-selector label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .mood-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .mood-option {
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .mood-option:hover {
          border-color: #007bff;
          transform: translateY(-1px);
        }

        .mood-option.selected {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .mood-label {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .mood-description {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .analyze-btn {
          width: 100%;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .mood-results {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .analysis-content h4 {
          color: #007bff;
          margin-bottom: 1rem;
        }

        .analysis-section {
          margin-bottom: 1rem;
        }

        .analysis-section h5 {
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .analysis-text {
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #374151;
          white-space: pre-line;
          max-height: 120px;
          overflow-y: auto;
        }

        .error-message {
          color: #dc3545;
          text-align: center;
          padding: 1rem;
          background: #f8d7da;
          border-radius: 0.5rem;
        }

        @media (max-width: 768px) {
          .mood-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

MoodAnalyzer.propTypes = {
  roomImage: PropTypes.string,
  onMoodAnalysis: PropTypes.func,
  className: PropTypes.string
}

export default MoodAnalyzer