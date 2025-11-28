import { Link } from "react-router-dom";
import "./NavBar.css";

export function NavBar() {
    return (
        <header className="navbar">
            <div className="navbar__content">
                <div className="navbar__brand">
                    <Link to="/" className="navbar__brandLink">CMS</Link>
                </div>
                <nav className="navbar__links">
                    <Link to="/" className="navbar__link">Članci</Link>
                    <Link to="/admin/articles" className="navbar__link">Admin – članci</Link>
                </nav>
            </div>
        </header>
    );
}