import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "./NavBar.css";

export function NavBar() {
    const { userEmail, logout } = useAuth();
    const navigate = useNavigate();

    const articlesHref = userEmail ? "/admin/articles" : "/";

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <Navbar 
            expand="lg" 
            className="navbar-custom"
            fixed="top"
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="text-warning fw-bold fs-4">
                    CMS DEMO SYSTEM
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto me-4">
                        <Nav.Link as={Link} to={articlesHref} className="text-light">
                            Članci
                        </Nav.Link>
                    </Nav>
                    
                    <Nav className="navbar-auth-section">
                        {!userEmail ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-light">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="text-light">
                                    Register
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <span className="text-secondary me-3">
                                    {userEmail}
                                </span>
                                <Button 
                                    variant="outline-warning" 
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}