import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ToolEvents from "./ToolEvents.jsx"

const Botaction = ({ messages }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message as it streams in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.sender === "user" ? "user-message" : "bot-message"
          }`}
        >
          {msg.sender === "bot" && (
            <ToolEvents events={msg.toolEvents} streaming={msg.streaming} />
          )}
          {msg.sender === "bot" ? (
            
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
          ) : (
            // User messages are plain text — no need to parse markdown
            <p>{msg.text}</p>
          )}

          {/* Streaming cursor on the last bot message while it's incomplete */}
          {msg.sender === "bot" &&
            index === messages.length - 1 &&
            msg.streaming && (
              <span className="cursor" aria-hidden="true" />
            )}
        </div>
      ))}

      {/* Invisible anchor scrolled into view on each update */}
      <div ref={bottomRef} />
    </div>
  );
};

export default Botaction;