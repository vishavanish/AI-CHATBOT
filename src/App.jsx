import { useState } from "react";
import Botaction from "./components/Botaction";
import Userinput from "./components/Userinput";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const appendChunk = (delta) =>
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],   // preserves streaming: true
        text: updated[updated.length - 1].text + delta,
      };
      return updated;
    });

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsStreaming(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, thread_id: "1" }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "", streaming: true },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .find((line) => line.startsWith("data: "));

          if (!dataLine) continue;

          const raw = dataLine.slice(6);
          if (raw === "[DONE]") break;

          try {
            const { delta, error } = JSON.parse(raw);
            if (error) throw new Error(error);
            if (delta) appendChunk(delta);
          } catch (e) {
            console.error("Failed to parse SSE payload:", raw, e);
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${error.message}`, streaming: false },
      ]);
      console.error(error);
    } finally {
      // Always runs — clears the cursor and unlocks the input
      setIsStreaming(false);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          streaming: false,
        };
        return updated;
      });
    }
  };

  return (
    <div className="chat-container">
      <Botaction messages={messages} />
      <Userinput onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  );
};

export default App;