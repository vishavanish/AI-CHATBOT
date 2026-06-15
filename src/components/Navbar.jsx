const Navbar = ({ title = "Claude Chat" }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✦</span>
        <span className="navbar-title">{title}</span>
      </div>
    </nav>
  );
};

export default Navbar;