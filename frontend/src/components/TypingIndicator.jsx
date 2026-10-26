import React from "react";

export default function TypingIndicator() {
  return (
    <div className="sc-bubble sc-bubble-bot sc-typing" aria-label="Assistant is typing">
      <span className="sc-dot" />
      <span className="sc-dot" />
      <span className="sc-dot" />
    </div>
  );
}
