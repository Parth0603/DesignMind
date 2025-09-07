import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const EXAMPLE_PROMPTS = [
  'Replace the sofa with a modern sectional in navy blue',
  'Change the coffee table to a glass-top design',
  'Add a large plant in the corner',
  'Replace the curtains with white blinds',
  'Change the wall color to sage green',
  'Add a bookshelf against the wall'
]

const PromptInput = ({ onSubmit, isLoading, className = '' }) => {
  const [prompt, setPrompt] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const textareaRef = useRef(null)
  const maxLength = 500

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [prompt])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading && prompt.trim().length >= 10) {
      onSubmit(prompt.trim())
      setPrompt('')
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  const isValidPrompt = prompt.trim().length >= 10

  return (
    <div className={`prompt-input ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Describe what you want to change... (minimum 10 characters)"
              className={`input textarea ${!isValidPrompt && prompt.length > 0 ? 'invalid' : ''}`}
              maxLength={maxLength}
              disabled={isLoading}
              aria-label="Describe changes to your room"
              rows={3}
            />
            
            {showSuggestions && prompt.length === 0 && (
              <div className="suggestions-dropdown">
                <div className="suggestions-header">Try these examples:</div>
                {EXAMPLE_PROMPTS.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="input-footer">
            <div className="input-meta">
              <div className={`character-count ${prompt.length > maxLength * 0.8 ? 'warning' : ''}`}>
                {prompt.length}/{maxLength}
              </div>
              {!isValidPrompt && prompt.length > 0 && (
                <div className="validation-hint">
                  Need at least {10 - prompt.trim().length} more characters
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValidPrompt || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  ✨ Generate
                </>
              )}
            </button>
          </div>
          
          <div className="keyboard-hint">
            Press Ctrl+Enter (Cmd+Enter on Mac) to generate quickly
          </div>
        </div>
      </form>
      
      <div className="tips">
        <h4>💡 Tips for better results:</h4>
        <ul>
          <li>Be specific about colors, styles, and materials</li>
          <li>Mention the furniture piece you want to change</li>
          <li>Describe the desired mood or aesthetic</li>
        </ul>
      </div>

      <style>{`
        .prompt-input {
          width: 100%;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .textarea-container {
          position: relative;
        }

        .textarea {
          resize: none;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .textarea.invalid {
          border-color: var(--warning);
          box-shadow: 0 0 0 2px rgba(237, 137, 54, 0.2);
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--neutral-300);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }

        .suggestions-header {
          padding: 0.75rem 1rem 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-700);
          border-bottom: 1px solid var(--neutral-200);
        }

        .suggestion-item {
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--neutral-600);
          transition: background-color 0.2s ease;
        }

        .suggestion-item:hover {
          background: var(--neutral-100);
          color: var(--neutral-800);
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 0.75rem;
          gap: 1rem;
        }

        .input-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .character-count {
          font-size: 0.875rem;
          color: var(--neutral-500);
          transition: color 0.2s ease;
        }

        .character-count.warning {
          color: var(--warning);
          font-weight: 600;
        }

        .validation-hint {
          font-size: 0.75rem;
          color: var(--warning);
        }

        .keyboard-hint {
          font-size: 0.75rem;
          color: var(--neutral-400);
          text-align: center;
          margin-top: 0.5rem;
        }

        .tips {
          background: var(--neutral-100);
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid var(--secondary);
        }

        .tips h4 {
          margin-bottom: 0.5rem;
          color: var(--neutral-700);
          font-size: 0.9rem;
        }

        .tips ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .tips li {
          font-size: 0.875rem;
          color: var(--neutral-600);
          margin-bottom: 0.25rem;
          padding-left: 1rem;
          position: relative;
        }

        .tips li::before {
          content: '•';
          color: var(--secondary);
          position: absolute;
          left: 0;
        }

        @media (max-width: 768px) {
          .input-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          
          .input-meta {
            align-items: center;
          }
          
          .suggestions-dropdown {
            max-height: 150px;
          }
          
          .keyboard-hint {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  )
}

PromptInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string
}

export default PromptInput