import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/35ffbd91b802e556e729776a9b26d95a49b76e03?placeholderIfAbsent=true"
            className="logo-image"
            alt="CSCVAN Logo"
          />
          <span className="logo-text">CSCVAN</span>
        </Link>

        <nav className="main-nav">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <div className="nav-spacer"></div>
          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>
          <div className="nav-spacer"></div>
        </nav>
      </div>
    </header>
  );
}
