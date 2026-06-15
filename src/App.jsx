import { useState, useEffect, useCallback } from "react";
import Botaction from "./components/Botaction";
import Userinput from "./components/Userinput";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";


const genThreadId = () =>
  `thread_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const THREAD_LIST_KEY = "chat_thread_ids";

const loadThreadList = () => {
  try {
    return JSON.parse(sessionStorage.getItem(THREAD_LIST_KEY)) ?? [];
  } catch {
    return [];
  }
};

const saveThreadList = (list) =>
  sessionStorage.setItem(THREAD_LIST_KEY, JSON.stringify(list));

const loadMessages = (threadId) => {
  try {
    return JSON.parse(sessionStorage.getItem(threadId)) ?? [];
  } catch {
    return [];
  }
};

const saveMessages = (threadId, messages) =>
  sessionStorage.setItem(threadId, JSON.stringify(messages));

// ── App ────────────────────────────────────────────────────────────────────

const App = () => {
  const [threads, setThreads] = useState(() => loadThreadList());
  const [activeThreadId, setActiveThreadId] = useState(() => {
    const list = loadThreadList();
    if (list.length > 0) return list[0];
    const id = genThreadId();
    saveThreadList([id]);
    return id;
  });
  const [messages, setMessages] = useState(() =>
    loadMessages(activeThreadId)
  );
  const [isStreaming, setIsStreaming] = useState(false);

  // Persist messages whenever they change
  useEffect(() => {
    if (!isStreaming) saveMessages(activeThreadId, messages);
  }, [messages, activeThreadId, isStreaming]);

  // ── thread management ──────────────────────────────────────────────────

  const startNewChat = useCallback(() => {
    const newId = genThreadId();
    const updated = [newId, ...threads];
    setThreads(updated);
    saveThreadList(updated);
    setActiveThreadId(newId);
    setMessages([]);
  }, [threads]);

  const selectThread = useCallback((id) => {
    setActiveThreadId(id);
    setMessages(loadMessages(id));
  }, []);

  // ── streaming ──────────────────────────────────────────────────────────

  const appendChunk = (delta) =>
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
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
        body: JSON.stringify({ message: text, thread_id: activeThreadId }),
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
    } finally {
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
    <div className="app-layout">
      <Navbar title="GEN AI CHATBOT" />

      <div className="app-body">
        <Sidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onNewChat={startNewChat}
          onSelectThread={selectThread}
        />

        <main className="chat-area">
          <div className="thread-badge">Thread: {activeThreadId}</div>
          <Botaction messages={messages} />
          <Userinput onSend={sendMessage} isStreaming={isStreaming} />
        </main>
      </div>
    </div>
  );
};

export default App;