import { useState } from "react";
import { register, type RegisterRequest } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

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
            login(result);           // centralni login
            navigate("/");           // ili na /admin, /articles itd.
        } catch (err) {
            console.error(err);
            setError("Registracija nije uspjela.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container" style={{ maxWidth: 500, marginTop: "3rem" }}>
            <div style={{
                background: 'var(--color-bg-card)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
            }}>
                <h1>Registracija</h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, email: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>Lozinka</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, password: e.target.value }))
                            }
                            required
                        />
                    </div>

                    {error && <p style={{ color: "var(--color-primary)", marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" disabled={loading} style={{width: '100%'}}>
                        {loading ? "Registriram..." : "Registriraj se"}
                    </button>
                </form>
            </div>
        </div>
    );
}
