import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { useAuth, type AuthResponse } from "../auth/AuthContext";

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
        <div className="container" style={{ maxWidth: 500, marginTop: "3rem" }}>
            <div style={{
                background: 'var(--color-bg-card)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
            }}>
                <h1>Prijava</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            Lozinka
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: "var(--color-primary)", marginBottom: '1rem' }}>{error}</p>}
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? "Prijava..." : "Prijavi se"}
                    </button>
                </form>
            </div>
        </div>
    );
}
