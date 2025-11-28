import { useState } from "react";
import { register, type RegisterRequest } from "../../api/auth";
import { useAuth } from "../../auth/AuthContext";
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
        <div className="container mt-4">
            <h2>Registracija</h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Lozinka</label>
                    <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Registriram..." : "Registriraj se"}
                </button>
            </form>
        </div>
    );
}
