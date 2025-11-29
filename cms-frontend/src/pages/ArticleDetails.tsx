import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { type Article, getArticle } from "../api/articles";

export function ArticleDetails() {
    const { id } = useParams<{ id: string }>();

    const articleId = id ? Number(id) : NaN;
    const isInvalidId = !id || Number.isNaN(articleId);

    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loading = !isInvalidId && !error && article === null;

    useEffect(() => {
        if (isInvalidId) return;

        let cancelled = false;

        getArticle(articleId)
            .then((a) => { if (!cancelled) setArticle(a); })
            .catch(() => { if (!cancelled) setError("Ne mogu dohvatiti članak."); });

        return () => { cancelled = true; };
    }, [articleId, isInvalidId]);

    if (isInvalidId) return <div className="container"><p style={{ color: "var(--color-primary)" }}>Neispravan ID članka.</p></div>;
    if (loading) return <div className="container"><p>Učitavanje...</p></div>;
    if (error) return <div className="container"><p style={{ color: "var(--color-primary)" }}>{error}</p></div>;
    if (!article) return <div className="container"><p>Članak nije pronađen.</p></div>;

    return (
        <div className="container">
            <p><Link to="/" style={{color: 'var(--color-primary)', fontWeight: 500}}>{`← Natrag na članke`}</Link></p>
            <h1>{article.title}</h1>
            {article.publishedAt && (
                <p className="article-meta">
                    Objavljeno: {new Date(article.publishedAt).toLocaleDateString('hr-HR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            )}
            <div className="article-details" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </div>
    );
}

export default ArticleDetails;