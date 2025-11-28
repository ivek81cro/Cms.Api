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
        <div style={{ maxWidth: 400, margin: "2rem auto" }}>
            <h1>Prijava</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        E-mail
                        <br />
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        Lozinka
                        <br />
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Prijava..." : "Prijavi se"}
                </button>
            </form>
        </div>
    );
}
