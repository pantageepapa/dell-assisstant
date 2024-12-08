"use client";

import React, { useState, FormEvent } from 'react';
import EmbeddedCalendar from './EmbeddedCalendar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  calendar?: boolean;
  consultantId?: number;
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
      return { text: "Thank you! How can I help you?" };
    } catch (error) {
      console.error("Error submitting startup name:", error);
      return { text: "I encountered an error processing your startup name. Could you please try again?" };
    }
  };

  const processResponse = async (userInput: string) => {
    if (isAwaitingStartupName) {
      const response = await handleStartupNameSubmission(userInput);
      setIsAwaitingStartupName(false);
      return response;
    }

    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('yes') || lowerInput.includes('yeah') || lowerInput.includes('yep') || lowerInput.includes('sure')) {
      setIsAwaitingStartupName(true);
      return { text: "What is the name of your startup?" };
    } 
    
    if (lowerInput.includes('no') || lowerInput.includes('nope') || lowerInput.includes('nah')) {
      return { text: "I am here to help you with other things as well!" };
    } 
    
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
    
    // Match consultant based on response
    if (data.response === "Healthcare") {
      return { 
        text: "I'll help you schedule a meeting with our Digital Health expert.", 
        calendar: true,
        consultantId: 1  // Elsa's ID
      };
    }
    if (data.response === "Finance") {
      return { 
        text: "I'll help you schedule a meeting with our Finance expert.", 
        calendar: true,
        consultantId: 2  // Jaeyoon's ID
      };
    }
    if (data.response === "Design") {
      return {
        text: "I'll help you schedule a meeting with our Design expert.",
        calendar: true,
        consultantId: 3  // Moritz's ID
      };
    }
    if (data.response === "Technology") {
      return {
        text: "I'll help you schedule a meeting with our Technology expert.",
        calendar: true,
        consultantId: 4  // Daniel's ID
      };
    }
    if (data.response === "General") {
      return {
        text: "I'll help you schedule a meeting with one of our generalist consultants.",
        calendar: true,
        consultantId: 4  // Daniel's ID
      };
    }
    
    return { text: data.response };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const botResponse = await processResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse.text,
        sender: "bot",
        calendar: botResponse.calendar,
        consultantId: botResponse.consultantId
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const renderMarkdown = (text: string) => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/(\d+)\.\s/g, '<br/>$1. ')
        }}
      />
    );
  };

  return (
    <div className="chat-container" style={styles.chatContainer}>
      <div className="chat-messages" style={styles.messages}>
        {messages.map((message) => (
          <div key={message.id} style={styles.messageContainer}>
            <div
              style={{
                ...styles.message,
                marginLeft: message.sender === 'user' ? 'auto' : '0',
                marginRight: message.sender === 'bot' ? 'auto' : '0',
                backgroundColor: message.sender === 'user' ? '#9fc5e8' : '#f1f1f1',
              }}
            >
              {renderMarkdown(message.text)}
            </div>
            {message.calendar && message.consultantId && (
              <div style={styles.calendar}>
                <EmbeddedCalendar consultantId={message.consultantId} />
              </div>
            )}
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
    padding: "20px",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  messageContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  message: {
    display: "inline-block",
    maxWidth: "60%",
    padding: "12px 16px",
    borderRadius: "20px",
    marginBottom: "4px",
    wordBreak: "break-word" as const,
  },
  calendar: {
    width: "100%",
    marginTop: "12px",
    marginBottom: "16px",
    border: "1px solid #eee",
    borderRadius: "8px",
    overflow: "hidden",
  },
  inputForm: {
    display: "flex",
    padding: "16px",
    borderTop: "1px solid #eee",
    backgroundColor: "#fff",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "12px 20px",
    border: "1px solid #ddd",
    borderRadius: "24px",
    fontSize: "16px",
    outline: "none",
  },
  sendButton: {
    padding: "12px 24px",
    backgroundColor: "#4285f4",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default ChatUI;