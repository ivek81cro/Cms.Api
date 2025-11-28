import { Link } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../../auth/AuthContext";

export function NavBar() {
    const { userEmail, logout } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar__content">
                <div className="navbar__brand">
                    <Link to="/" className="navbar__brandLink">CMS</Link>
                </div>

                <nav className="navbar__links">
                    <Link to="/" className="navbar__link">Članci</Link>
                    {userEmail && (
                        <Link to="/admin/articles" className="navbar__link">
                            Admin – članci
                        </Link>
                    )}
                </nav>

                <div className="navbar__auth">
                    {!userEmail ? (
                        <>
                            <Link to="/login" className="navbar__link">Login</Link>
                            <Link to="/register" className="navbar__link">Register</Link>
                        </>
                    ) : (
                        <>
                            <span className="navbar__user">{userEmail}</span>
                            <button
                                type="button"
                                className="navbar__link navbar__logoutButton"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}