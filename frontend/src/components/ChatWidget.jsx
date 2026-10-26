import React, { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../api.js";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import QuickReplies from "./QuickReplies.jsx";
import "./ChatWidget.css";

const WELCOME_MESSAGE =
  "Namaste! 👋 Welcome to The Scholars Cafe. I'm Scholar, your virtual assistant. I can help with our menu, popular dishes, timings, location, delivery, and more. How can I help you today?";

const FALLBACK_MESSAGE =
  "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or reach out to The Scholars Cafe directly and our team will be happy to help.";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newHistory = [...messages, { role: "user", content: trimmed }];
    setMessages(newHistory);
    setInput("");
    setShowQuickReplies(false);
    setIsTyping(true);

    try {
      // send conversation memory (this session only) so replies stay contextual
      const historyForApi = newHistory
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply } = await sendChatMessage(trimmed, historyForApi.slice(0, -1));
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: FALLBACK_MESSAGE, isError: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleQuickReply(qr) {
    if (qr.value === "__ASK_A_QUESTION__") {
      setShowQuickReplies(false);
      inputRef.current?.focus();
      return;
    }
    sendMessage(qr.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {!isOpen && (
        <button
          className="sc-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with The Scholars Cafe assistant"
        >
          <span className="sc-fab-icon">💬</span>
          <span className="sc-fab-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="sc-window" role="dialog" aria-label="The Scholars Cafe chat assistant">
          <div className="sc-header">
            <div className="sc-header-info">
              <div className="sc-avatar">☕</div>
              <div>
                <div className="sc-header-title">Scholar · Cafe Assistant</div>
                <div className="sc-header-sub">
                  <span className="sc-status-dot" /> Online now
                </div>
              </div>
            </div>
            <button
              className="sc-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="sc-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                role={m.role}
                content={m.content}
                isError={m.isError}
              />
            ))}
            {isTyping && <TypingIndicator />}

            {showQuickReplies && !isTyping && (
              <QuickReplies onSelect={handleQuickReply} disabled={isTyping} />
            )}
          </div>

          {!showQuickReplies && (
            <div className="sc-quick-toggle-row">
              <button
                className="sc-quick-toggle"
                onClick={() => setShowQuickReplies(true)}
              >
                ⚡ Quick options
              </button>
            </div>
          )}

          <form className="sc-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={800}
              placeholder="Type your message... (Telugu-English is fine!)"
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              aria-label="Type your message"
            />
            <button type="submit" disabled={isTyping || !input.trim()} aria-label="Send message">
              ➤
            </button>
          </form>
          <div className="sc-footer-note">Powered by The Scholars Cafe AI Assistant</div>
        </div>
      )}
    </>
  );
}
