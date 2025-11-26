import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-2">
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft typing-dot-1"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft typing-dot-2"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft typing-dot-3"></div>
    </div>
  );
};

// Breathing Icon Component
const BreathingIcon = () => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="absolute w-6 h-6 bg-primary-light rounded-full animate-breathe"></div>
      <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
    </div>
  );
};

// Mood Selector Component
const MoodSelector = ({ onSelectMood, userName }) => {
  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😕', label: 'Confused', value: 'confused' },
    { emoji: '😢', label: 'Overwhelmed', value: 'overwhelmed' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-medium text-calm-text mb-2">
          {userName ? `Hi ${userName},` : 'Hi there,'} I'm here for you.
        </h2>
        <p className="text-calm-textLight text-lg">How are you feeling today?</p>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-4 gap-4 max-w-md mx-auto">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onSelectMood(mood.value, mood.label)}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-primary-light transition-all duration-300 hover:scale-105 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {mood.emoji}
            </span>
            <span className="text-xs md:text-sm text-calm-textLight font-medium">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-center mt-6 text-sm text-calm-textLight italic">
        Take your time. You're doing well.
      </p>
    </div>
  );
};

// Message Component
const Message = ({ message, index }) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`flex flex-col max-w-[75%] md:max-w-[60%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-soft ${
            isUser
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-white text-calm-text rounded-bl-sm border border-primary-light'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <span className="text-xs text-calm-textLight mt-1 px-1">{timestamp}</span>
      </div>
    </div>
  );
};

// Calming Micro-copy Component
const CalmingMicroCopy = () => {
  const messages = [
    "Take your time.",
    "You're doing well.",
    "I'm here with you.",
    "Your feelings are valid.",
  ];
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-2">
      <p className="text-sm text-calm-textLight italic animate-fade-in">
        {messages[currentMessage]}
      </p>
    </div>
  );
};

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('welcome'); // welcome → mood → chat
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when stage changes to chat
  useEffect(() => {
    if (stage === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [stage]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameInput(false);
      setStage('mood');
    }
  };

  const handleMoodSelect = async (moodValue, moodLabel) => {
    setStage('chat');
    
    const welcomeMessage = {
      text: `I see you're feeling ${moodLabel.toLowerCase()} today. I'm here to listen and support you. What's on your mind?`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([welcomeMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/mood', {
        mood: moodValue,
      });

      const botMessage = {
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([welcomeMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMessage, errorMessage]);
    }

    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
      });

      const botMessage = {
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-bg via-white to-accent-teal/20 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-light/30 shadow-soft sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BreathingIcon />
            <h1 className="text-xl md:text-2xl font-semibold text-calm-text">
              Calm Companion
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        {stage === 'welcome' && showNameInput && (
          <div className="flex-1 flex items-center justify-center animate-fade-in">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-medium text-calm-text mb-3">
                  Welcome
                </h2>
                <p className="text-lg text-calm-textLight">
                  I'm here to support you. Let's start with your name.
                </p>
              </div>
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="What should I call you?"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-primary-light focus:border-primary focus:outline-none bg-white text-calm-text placeholder-calm-textLight shadow-soft transition-all duration-300 text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-medium shadow-soft-lg hover:shadow-soft transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        )}

        {stage === 'mood' && (
          <div className="flex-1 flex items-center justify-center">
            <MoodSelector onSelectMood={handleMoodSelect} userName={userName} />
          </div>
        )}

        {stage === 'chat' && (
          <>
            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto chat-window mb-4 rounded-2xl bg-white/50 backdrop-blur-sm p-4 md:p-6 shadow-soft">
              {messages.map((msg, index) => (
                <Message key={index} message={msg} index={index} />
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white rounded-2xl rounded-bl-sm border border-primary-light shadow-soft px-4 py-3">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Calming Micro-copy */}
            {messages.length > 0 && <CalmingMicroCopy />}

            {/* Input Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-primary-light/30 p-3 md:p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write whatever you're feeling..."
                    rows="1"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-primary-light focus:border-primary focus:outline-none bg-white text-calm-text placeholder-calm-textLight resize-none overflow-hidden transition-all duration-300 text-sm md:text-base"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium shadow-soft transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center min-w-[80px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
