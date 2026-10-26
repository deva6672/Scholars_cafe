import React from "react";

const QUICK_REPLIES = [
  { label: "📋 View Menu", value: "Can you show me the menu?" },
  { label: "⭐ Popular Items", value: "What are your most popular dishes?" },
  { label: "🕒 Opening Hours", value: "What are your opening hours?" },
  { label: "📍 Location & Directions", value: "Where are you located? How do I get there?" },
  { label: "📞 Contact Cafe", value: "How can I contact the cafe?" },
  { label: "🚗 Delivery", value: "Do you offer delivery or drive-through?" },
  { label: "💬 Ask a Question", value: "__ASK_A_QUESTION__" },
];

export default function QuickReplies({ onSelect, disabled }) {
  return (
    <div className="sc-quick-replies">
      {QUICK_REPLIES.map((qr) => (
        <button
          key={qr.label}
          className="sc-quick-reply-btn"
          disabled={disabled}
          onClick={() => onSelect(qr)}
        >
          {qr.label}
        </button>
      ))}
    </div>
  );
}

export { QUICK_REPLIES };
