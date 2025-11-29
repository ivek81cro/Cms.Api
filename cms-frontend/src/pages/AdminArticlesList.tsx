import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type Article, getArticles, deleteArticle } from "../api/articles";

export function AdminArticlesList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const load = () => {
        setLoading(true);
        getArticles()
            .then(setArticles)
            .catch(err => {
                console.error(err);
                setError("Greška kod učitavanja članaka.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Sigurno obrisati članak?")) return;
        try {
            await deleteArticle(id);
            load();
        } catch (err) {
            console.error(err);
            alert("Greška kod brisanja članka.");
        }
    };

    if (loading) return <div className="container"><p>Učitavanje...</p></div>;
    if (error) return <div className="container"><p style={{color: 'var(--color-primary)'}}>{error}</p></div>;

    return (
        <div className="container">
            <h1>Admin – Članci</h1>

            <button
                onClick={() => navigate("/admin/articles/new")}
                style={{ marginBottom: "1.5rem" }}
            >
                + Novi članak
            </button>

            {articles.length === 0 ? (
                <p style={{color: 'var(--color-muted)'}}>Nema članaka.</p>
            ) : (
                <div style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '24px',
                    overflowX: 'auto'
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", borderBottom: "2px solid var(--color-border)", paddingBottom: '12px', color: 'var(--color-primary)' }}>Naslov</th>
                                <th style={{ textAlign: "left", borderBottom: "2px solid var(--color-border)", paddingBottom: '12px', color: 'var(--color-primary)' }}>Objavljen</th>
                                <th style={{ textAlign: "left", borderBottom: "2px solid var(--color-border)", paddingBottom: '12px', color: 'var(--color-primary)' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(a => (
                                <tr key={a.id} style={{borderBottom: '1px solid var(--color-border)'}}>
                                    <td style={{ padding: "16px 0" }}>{a.title}</td>
                                    <td>{a.isPublished ? "Da" : "Ne"}</td>
                                    <td>
                                        <Link
                                            to={`/admin/articles/${a.id}`}
                                            style={{ marginRight: "12px", color: 'var(--color-primary)', fontWeight: 500 }}
                                        >
                                            Uredi
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(a.id)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #ef4444',
                                                color: '#ef4444',
                                                padding: '6px 12px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Obriši
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
