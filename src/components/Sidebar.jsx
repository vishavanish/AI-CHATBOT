const Sidebar = ({ threads, activeThreadId, onNewChat, onSelectThread }) => {
  return (
    <aside className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="past-conversations">
        <p className="sidebar-section-title">Past Conversations</p>
        <ul className="thread-list">
          {threads.map((id) => (
            <li key={id}>
              <button
                className={`thread-btn ${id === activeThreadId ? "active" : ""}`}
                onClick={() => onSelectThread(id)}
              >
                <span className="thread-icon">💬</span>
                <span className="thread-label">Thread {id.slice(-6)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;