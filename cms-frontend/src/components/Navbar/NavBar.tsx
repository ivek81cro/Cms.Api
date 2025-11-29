import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../../auth/AuthContext";

export function NavBar() {
    const { userEmail, logout } = useAuth();
    const navigate = useNavigate();

    // Jedan link "Članci":
    // - ulogiran -> vodi na admin uređivanje
    // - nije ulogiran -> vodi na javnu listu
    const articlesHref = userEmail ? "/admin/articles" : "/";


    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <header className="navbar">
            <div className="navbar__content">
                {/* Brand */}
                <div className="navbar__brand">
                    <Link to="/" className="navbar__brandLink">CMS</Link>
                </div>

                {/* Glavni linkovi */}
                <nav className="navbar__links">
                    <Link to={articlesHref} className="navbar__link">Članci</Link>
                </nav>

                {/* Auth dio desno */}
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
                                onClick={handleLogout}
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