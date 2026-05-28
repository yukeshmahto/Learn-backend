import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const Navbar = ({ user, onLogout }) => {
  const loggedIn = isLoggedIn();

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/">VideoLearn</Link>
      </div>
      <nav>
        <Link to="/">Home</Link>
        {loggedIn && <Link to="/upload">Upload</Link>}
        {loggedIn && <Link to="/profile">Profile</Link>}
      </nav>
      <div className="nav-actions">
        {loggedIn ? (
          <>
            <span className="user-badge">
              {user?.Username || user?.fullName || "Me"}
            </span>
            <button className="button button-secondary" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="button button-outline" to="/login">
              Login
            </Link>
            <Link className="button button-primary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
