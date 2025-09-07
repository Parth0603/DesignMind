import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { aiDesignerChat } from '../services/aiChat'

const AIChat = ({ roomImage, className = '' }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hi! I\'m your AI Interior Designer. Ask me about colors, furniture, layouts, or any design question!' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await aiDesignerChat(inputMessage, roomImage)
      const cleanResponse = aiResponse.replace(/\*/g, '')
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: cleanResponse
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again!'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyPrompt = (text, messageId) => {
    const promptMatch = text.match(/Prompt:\s*(.+?)$/s)
    if (promptMatch) {
      let promptText = promptMatch[1].trim()
      // Ensure prompt is under 500 characters
      if (promptText.length > 500) {
        promptText = promptText.substring(0, 480).trim() + '...'
      }
      navigator.clipboard.writeText(promptText).then(() => {
        setCopiedMessageId(messageId)
        setTimeout(() => setCopiedMessageId(null), 2000)
      }).catch(err => {
        console.error('Copy failed:', err)
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`ai-chat ${className}`}>
      <div className="chat-header">
        <h3>💬 AI Design Chat</h3>
        <p>Get instant design advice and suggestions</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-bubble">
              <div className="message-avatar">
                {message.type === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-text">
                {message.text.includes('Prompt:') ? (
                  <div>
                    <div className="answer-section">
                      {message.text.split('Prompt:')[0].trim()}
                    </div>
                    <div className="prompt-section">
                      <div className="prompt-text">
                        <strong>Prompt:</strong> {(() => {
                          const fullPrompt = message.text.split('Prompt:')[1]?.trim() || ''
                          return fullPrompt.length > 500 ? fullPrompt.substring(0, 480).trim() + '...' : fullPrompt
                        })()}
                      </div>
                      <button 
                        className={`copy-btn ${copiedMessageId === message.id ? 'copied' : ''}`}
                        onClick={() => copyPrompt(message.text, message.id)}
                        title={copiedMessageId === message.id ? 'Prompt copied!' : 'Copy complete prompt'}
                      >
                        {copiedMessageId === message.id ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                ) : (
                  message.text
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div className="message-bubble">
              <div className="message-avatar">🤖</div>
              <div className="message-text">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Thinking...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about colors, furniture, layouts..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          {isLoading ? '⏳' : '➤'}
        </button>
      </div>

      <style>{`
        .ai-chat {
          display: flex;
          flex-direction: column;
          height: 400px;
          background: white;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .chat-header {
          padding: 1rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e5e7eb;
          text-align: center;
        }

        .chat-header h3 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .chat-header p {
          margin: 0;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          align-items: flex-start;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.ai {
          justify-content: flex-start;
        }

        .message-bubble {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          max-width: 85%;
        }

        .message.user .message-bubble {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          background: #f3f4f6;
        }

        .message.user .message-avatar {
          background: #007bff;
          color: white;
        }

        .message-text {
          background: #f3f4f6;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          line-height: 1.4;
          color: #374151;
          border: 1px solid #e5e7eb;
          position: relative;
        }

        .message.user .message-text {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .message.user .prompt-section {
          background: rgba(255, 255, 255, 0.2);
          border-left-color: white;
        }

        .answer-section {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .prompt-section {
          background: rgba(0, 123, 255, 0.1);
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 3px solid #007bff;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .prompt-text {
          flex: 1;
          line-height: 1.4;
        }

        .copy-btn {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .copy-btn:hover {
          background: #0056b3;
        }

        .copy-btn.copied {
          background: #28a745;
        }

        .typing-dots {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #007bff;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .typing-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-input {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.75rem;
          background: #f8f9fa;
        }

        .chat-input input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .chat-input input::placeholder {
          color: #9ca3af;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #007bff;
        }

        .chat-input button {
          padding: 0.75rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .chat-input button:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

AIChat.propTypes = {
  roomImage: PropTypes.string,
  className: PropTypes.string
}

export default AIChat