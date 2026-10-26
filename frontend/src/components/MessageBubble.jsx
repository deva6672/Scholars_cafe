import React from "react";

export default function MessageBubble({ role, content, isError }) {
  const isUser = role === "user";
  return (
    <div
      className={`sc-bubble ${isUser ? "sc-bubble-user" : "sc-bubble-bot"} ${
        isError ? "sc-bubble-error" : ""
      }`}
    >
      {content.split("\n").map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i !== content.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
}
