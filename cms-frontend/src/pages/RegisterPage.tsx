import { useState } from "react";
import { register, type RegisterRequest } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterRequest>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await register(form);
            login(result);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Registracija nije uspjela.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container style={{ maxWidth: 500, marginTop: "3rem" }}>
            <Card className="card-custom">
                <Card.Body>
                    <h1 className="mb-4">Registracija</h1>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formRegisterEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, email: e.target.value }))
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterPassword">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, password: e.target.value }))
                                }
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
                            {loading ? "Registriram..." : "Registriraj se"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
