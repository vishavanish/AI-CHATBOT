import { useState } from "react";

const Userinput = ({ onSend, isStreaming }) => {
  const [message, setMessage] = useState("");

  const isDisabled = message.trim() === "" || isStreaming;

  const handleSend = () => {
    if (isDisabled) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <div className="input-area">
      <textarea
        value={message}
        className="user-input"
        placeholder="Type here..."
        rows={1}
        disabled={isStreaming}
        onChange={(e) => {
          setMessage(e.target.value);
          // Auto-grow: reset height first so it can shrink back down
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          // Enter sends; Shift+Enter inserts a newline
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={isDisabled}
        className={`send-button ${isDisabled ? "send-button--disabled" : ""}`}
        aria-label={isStreaming ? "Waiting for response..." : "Send message"}
      >
        {isStreaming ? (
          // Spinner while bot is replying
          <span className="spinner" aria-hidden="true" />
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
};

export default Userinput;