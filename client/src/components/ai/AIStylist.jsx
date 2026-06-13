import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMessageSquare } from 'react-icons/fi';
import './AIStylist.css';

const SUGGESTED_QUESTIONS = [
  "What's my body type?",
  "Recommend earrings for me",
  "Suggest everyday jewelry",
  "Wedding collection ideas",
  "Minimal jewelry style",
];

export default function AIStylist({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm your personal style assistant. I can help you find the perfect jewelry based on your preferences, body type, and occasion. What brings you here today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedSuggestion(null);

    // Simulate AI response (would be replaced with real Gemini API call)
    setLoading(true);
    try {
      // TODO: Replace with actual Gemini API call
      const aiResponse = generateStylistResponse(messageText);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
          recommendations: extractRecommendations(aiResponse),
        }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('AI Stylist error:', error);
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setSelectedSuggestion(question);
    handleSendMessage(question);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="ai-stylist-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="ai-stylist-drawer">
        {/* Header */}
        <div className="ai-stylist-header">
          <div className="ai-stylist-header-content">
            <FiMessageSquare className="ai-stylist-header-icon" size={20} />
            <div>
              <h2 className="ai-stylist-title">Style Assistant</h2>
              <p className="ai-stylist-subtitle">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ai-stylist-close"
            aria-label="Close stylist"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-stylist-messages">
          {messages.map(message => (
            <div
              key={message.id}
              className={`ai-stylist-message ${message.sender}`}
            >
              <div className="ai-stylist-message-content">
                <p className="ai-stylist-message-text">{message.text}</p>
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="ai-stylist-recommendations">
                    {message.recommendations.map((rec, idx) => (
                      <a
                        key={idx}
                        href={rec.link}
                        className="ai-stylist-recommendation-item"
                      >
                        {rec.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="ai-stylist-message ai">
              <div className="ai-stylist-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !loading && (
          <div className="ai-stylist-suggestions">
            <p className="ai-stylist-suggestions-label">Quick questions:</p>
            <div className="ai-stylist-suggestions-list">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(q)}
                  className={`ai-stylist-suggestion ${selectedSuggestion === q ? 'active' : ''}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="ai-stylist-input-area">
          <div className="ai-stylist-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSendMessage(input);
                }
              }}
              placeholder="Ask me about jewelry styles..."
              className="ai-stylist-input"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={loading || !input.trim()}
              className="ai-stylist-send"
              aria-label="Send message"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Temporary response generator (replace with Gemini API)
function generateStylistResponse(message) {
  const responses = {
    'body type': 'Based on common jewelry recommendations:\n\n• Petite frames: Delicate pieces, smaller earrings\n• Tall/athletic: Statement jewelry, larger designs\n• Curvy: Balanced pieces, layering works well\n\nWhat\'s your body type? I can give more specific recommendations!',
    'earring': 'Earrings are such a versatile statement! Here are some options:\n\n• Drop earrings: Elongate the face\n• Studs: Timeless and versatile\n• Hoops: Works for most face shapes\n• Chandelier: Bold and elegant\n\nWhat\'s your style preference?',
    'everyday': 'For everyday wear, I recommend:\n\n• Delicate necklaces\n• Minimalist rings\n• Small hoops or studs\n• Gold or silver chains\n\nThese are versatile and go with everything!',
    'wedding': 'For wedding jewelry:\n\n• Bridal sets: Coordinated elegance\n• Statement earrings: If necklace is minimal\n• Bangles: Traditional and beautiful\n• Layered necklaces: Modern bride look\n\nWhat\'s your dress style?',
    'minimal': 'Minimalist jewelry is so elegant!\n\n• Single delicate necklace\n• One simple ring\n• Small earrings\n• Avoid clutter\n• Quality over quantity\n\nPerfect for a sophisticated look!',
  };

  for (const [key, response] of Object.entries(responses)) {
    if (message.toLowerCase().includes(key)) {
      return response;
    }
  }

  return 'That\'s a great question! I can help you find the perfect jewelry piece. Could you tell me more about:\n\n• Your personal style\n• The occasion\n• Your preferences (gold, silver, minimal, statement)\n\nThis will help me give you better recommendations!';
}

function extractRecommendations(text) {
  // Simple extraction (would be more sophisticated with real API)
  const links = [];
  if (text.toLowerCase().includes('earring')) {
    links.push({ name: 'View Earrings', link: '/collections/earrings' });
  }
  if (text.toLowerCase().includes('necklace')) {
    links.push({ name: 'View Necklaces', link: '/collections/necklaces' });
  }
  if (text.toLowerCase().includes('ring')) {
    links.push({ name: 'View Rings', link: '/collections/rings' });
  }
  return links;
}
