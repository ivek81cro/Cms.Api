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

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Admin – članci</h1>

            <button
                onClick={() => navigate("/admin/articles/new")}
                style={{ marginBottom: "1rem" }}
            >
                + Novi članak
            </button>

            {articles.length === 0 ? (
                <p>Nema članaka.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Naslov</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Objavljen</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(a => (
                            <tr key={a.id}>
                                <td style={{ padding: "0.4rem 0" }}>{a.title}</td>
                                <td>{a.isPublished ? "Da" : "Ne"}</td>
                                <td>
                                    <Link
                                        to={`/admin/articles/${a.id}`}
                                        style={{ marginRight: "0.5rem" }}
                                    >
                                        Uredi
                                    </Link>
                                    <button onClick={() => handleDelete(a.id)}>Obriši</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
