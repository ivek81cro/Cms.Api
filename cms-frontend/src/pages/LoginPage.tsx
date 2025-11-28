import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

interface LocationState {
    from?: { pathname: string };
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | undefined;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await login({ email, password });
            localStorage.setItem("authToken", result.token);
            // vrati se gdje je htio ići ili na admin/articles
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
