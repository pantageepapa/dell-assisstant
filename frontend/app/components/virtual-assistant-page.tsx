"use client";
import { useState, FormEvent } from "react";
import VirtualAssistant from "./VirtualAssistant";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function VirtualAssistantUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Get bot response
      const queryParams = new URLSearchParams({ message: input });
      const response = await fetch(
        `http://localhost:8000/chat/text?${queryParams}`
      );
      const data = await response.json();

      // Start speaking when response received
      setSpeaking(true);
      console.log("Speaking started");

      // Add bot message
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);

      // Stop speaking after response duration
      setTimeout(() => {
        setSpeaking(false);
        console.log("Speaking ended");
      }, data.response.length * 100); // Adjust timing if needed
    } catch (error) {
      console.error("Error:", error);
      setSpeaking(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-full h-full">
          <VirtualAssistant speaking={speaking} />
        </div>
      </div>
      <div className="w-1/2 h-full p-4 flex" onClick={handleButtonClick}>
        <div className="chat-container w-full" style={styles.chatContainer}>
          <div className="chat-messages" style={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.message,
                  alignSelf:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.sender === "user" ? "#d1f7c4" : "#f1f1f1",
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
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column" as const,
    width: "90%",
    height: "calc(100% - 85px)",
    marginTop: "75px",
    marginBottom: "25px",
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
