// src/pages/RegisterPage.tsx
import { useState } from "react";
import { register, RegisterRequest, AuthResponse } from "../api/auth";

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterRequest>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<AuthResponse | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const result = await register(form);

            // spremi token za daljnje pozive
            localStorage.setItem("authToken", result.token);
            setSuccess(result);
        } catch (err: any) {
            console.error(err);
            setError("Registracija nije uspjela. Provjeri email i lozinku.");
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
                {success && (
                    <div className="alert alert-success">
                        Registracija uspješna, prijavljen si kao {success.email}.
                    </div>
                )}

                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Registriram..." : "Registriraj se"}
                </button>
            </form>
        </div>
    );
}
