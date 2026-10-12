import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github.css";
import "./Chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userInput = input.trim();

    // Add user message
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userInput,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while processing your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">

      {/* Header */}
      <header className="chat-header">
        <div className="ai-logo">
          AI
        </div>

        <div>
          <h1>KS Customer Support Agent</h1>
          <span>Powered by KS</span>
        </div>
      </header>

      {/* Messages */}
      <main className="chat-messages">

        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">
              ✨
            </div>

            <h2>How can I help you?</h2>

            <p>
              Ask me anything about your insurance policies,
              products, claims, or customer support.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${
              message.role === "user"
                ? "user-row"
                : "assistant-row"
            }`}
          >

            {/* Avatar */}
            <div
              className={`message-avatar ${
                message.role === "user"
                  ? "user-avatar"
                  : "assistant-avatar"
              }`}
            >
              {message.role === "user" ? "You" : "AI"}
            </div>

            {/* Message */}
            <div
              className={`message-content ${
                message.role === "user"
                  ? "user-content"
                  : "assistant-content"
              }`}
            >

              {message.role === "user" ? (
                <div>{message.content}</div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {message.content}
                </ReactMarkdown>
              )}

            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="message-row assistant-row">

            <div className="message-avatar assistant-avatar">
              AI
            </div>

            <div className="assistant-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>
        )}

      </main>

      {/* Input */}
      <div className="chat-input-container">

        <div className="chat-input-wrapper">

          <input
            type="text"
            value={input}
            placeholder="Ask something..."
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

        <small>
          AI can make mistakes. Please verify important information.
        </small>

      </div>

    </div>
  );
}

export default Chat;