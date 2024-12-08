import React, { useState, FormEvent } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (input.trim() === '') return;

  // Add user message
  const userMessage: Message = {
    id: messages.length + 1,
    text: input,
    sender: 'user',
  };
  setMessages(prev => [...prev, userMessage]);
  setInput('');

  try {
    // Use URLSearchParams for query parameters
    const queryParams = new URLSearchParams({ message: input });
    const response = await fetch(
      `http://localhost:8000/chat/text?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // Add bot response
    const botMessage: Message = {
      id: messages.length + 2,
      text: data.response,
      sender: "bot",
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error:", error);
  }
};


  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
  };

  return (
    <div className="chat-container" style={styles.chatContainer} onClick={handleButtonClick}>
      <div className="chat-messages" style={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? '#d1f7c4' : '#f1f1f1',
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column" as const,
    width: "90%",
    height: "calc(100% - 75px)",
    marginTop: "75px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "18px",
    maxWidth: "80%",
  },
  inputForm: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "18px",
    marginRight: "8px",
    outline: "none",
  },
  sendButton: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
  },
};

export default ChatUI;
