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

    if (loading) return <div className="container"><p>Učitavanje...</p></div>;
    if (error) return <div className="container"><p style={{ color: "red" }}>{error}</p></div>;

    // Prikazuj samo objavljene članke
    const published = articles.filter(a => a.isPublished);

    return (
        <>
            <section className="hero">
                <div className="container">
                    <h1>Moto Gymkhana Croatia</h1>
                    <p>Škola sigurne vožnje • Treninzi • Natjecanja</p>
                </div>
            </section>

            <div className="container">
                <h2>Najnovije Vijesti</h2>
                <div className="cards">
                    {published.map(a => (
                        <article key={a.id} className="card">
                            <h2 className="card__title">
                                <Link to={`/articles/${a.id}`}>{a.title}</Link>
                            </h2>
                            {a.publishedAt && (
                                <div className="article-meta">
                                    Objavljeno: {new Date(a.publishedAt).toLocaleDateString('hr-HR')}
                                </div>
                            )}
                            <p className="card__excerpt">{a.excerpt}</p>
                            <Link to={`/articles/${a.id}`} className="navbar__link">
                                Pročitaj više →
                            </Link>
                        </article>
                    ))}
                    {published.length === 0 && (
                        <p style={{ color: "var(--color-muted)" }}>Nema objavljenih članaka.</p>
                    )}
                </div>
            </div>
        </>
    );
}