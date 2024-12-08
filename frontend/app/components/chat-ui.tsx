import React, { useState, FormEvent } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi! I am here to help you with any questions regarding the startup program. Do you have a startup?",
    sender: 'bot'
  }
];

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isAwaitingStartupName, setIsAwaitingStartupName] = useState(false);

  const handleStartupNameSubmission = async (startupName: string) => {
    try {
      fetch(
        `http://127.0.0.1:8000/company?company_name=${encodeURIComponent(startupName)}`,
        {
          method: "POST",
          headers: {
            "accept": "application/json"
          },
          body: ""
        }
      );

      return "Thank you! How can I help you?";
    } catch (error) {
      console.error("Error submitting startup name:", error);
      return "I encountered an error processing your startup name. Could you please try again?";
    }
  };

  const processResponse = async (userInput: string) => {
    if (isAwaitingStartupName) {
      const response = await handleStartupNameSubmission(userInput);
      setIsAwaitingStartupName(false);
      return response;
    } else {
      // Check if the user's response indicates they have a startup
      const lowerInput = userInput.toLowerCase();
      if (lowerInput.includes('yes') || lowerInput.includes('yeah') || lowerInput.includes('yep') || lowerInput.includes('sure')) {
        setIsAwaitingStartupName(true);
        return "What is the name of your startup?";
      } else if (lowerInput.includes('no') || lowerInput.includes('nope') || lowerInput.includes('nah')) {
        return "That's okay! How can I help you?";
      }
      
      // Default flow for other responses
      const queryParams = new URLSearchParams({ message: userInput });
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
      return data.response;
    }
  };

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
      const botResponse = await processResponse(input);
      
      // Add bot response
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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