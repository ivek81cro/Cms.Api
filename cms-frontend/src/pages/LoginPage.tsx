import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { useAuth, type AuthResponse } from "../auth/AuthContext";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

interface LocationState {
    from?: { pathname: string };
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | undefined;
    const { login: ctxLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await apiLogin({ email, password }) as AuthResponse;
            // Update global auth state -> NavBar switches to Logout immediately
            ctxLogin(result);

            const redirectTo = state?.from?.pathname ?? "/admin/articles";
            navigate(redirectTo, { replace: true });
        } catch (err) {
            console.error(err);
            setError("Neispravan e-mail ili lozinka.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ maxWidth: 500, marginTop: "3rem" }}>
            <Card className="card-custom">
                <Card.Body>
                    <h1 className="mb-4">Prijava</h1>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Button 
                            variant="warning" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? "Prijava..." : "Prijavi se"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
