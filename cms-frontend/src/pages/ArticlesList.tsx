import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type Article, getArticles } from "../api/articles";

export function ArticlesList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getArticles()
            .then(setArticles)
            .catch(() => setError("Ne mogu dohvatiti članke."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Novosti</h1>
            {articles.map(a => (
                <article key={a.id} style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ margin: 0 }}>
                        <Link to={`/articles/${a.id}`} style={{ textDecoration: "none", color: "#1e3a8a" }}>
                            {a.title}
                        </Link>
                    </h2>
                    <p style={{ margin: "0.5rem 0 0.75rem" }}>{a.excerpt}</p>
                    <Link to={`/articles/${a.id}`}>Pročitaj više →</Link>
                </article>
            ))}
        </div>
    );
}
