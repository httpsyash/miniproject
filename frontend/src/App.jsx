// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Before we start, how are you feeling today? Please describe your mood.", sender: "bot" }
  ]);
  const [loading, setLoading] = useState(false);

  // NEW — To check if user already entered mood or not
  const [stage, setStage] = useState("askMood");  // askMood → chat

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      let response;

      // FIRST MESSAGE (MOOD)
      if (stage === "askMood") {
        response = await axios.post('http://localhost:5000/api/mood', {
          mood: input
        });

        setMessages([
          ...newMessages,
          { text: response.data.reply, sender: "bot" }
        ]);

        setStage("chat");  // NOW SWITCH TO NORMAL CHAT

      } 
      // NORMAL CHAT AFTER MOOD IS SET
      else {
        response = await axios.post('http://localhost:5000/api/chat', {
          message: input
        });

        setMessages([
          ...newMessages,
          { text: response.data.reply, sender: "bot" }
        ]);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { text: "Sorry, I'm having trouble connecting right now.", sender: "bot" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="chat-header">
        <h1>Mental & Educational Support</h1>
        
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={
            stage === "askMood"
              ? "Describe your current mood..."
              : "Send a message..."
          }
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
