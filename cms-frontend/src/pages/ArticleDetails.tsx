import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { type Article, getArticle } from "../api/articles";

export function ArticleDetails() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const articleId = Number(id);
        if (!id || Number.isNaN(articleId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("Neispravan ID članka.");
            setLoading(false);
            return;
        }

        getArticle(articleId)
            .then(setArticle)
            .catch(() => setError("Ne mogu dohvatiti članak."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!article) return <p>Članak nije pronađen.</p>;

    return (
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <p><Link to="/">{`←`} Natrag na članke</Link></p>
            <h1>{article.title}</h1>
            {article.publishedAt && (
                <p style={{ color: "#666" }}>
                    Objavljeno: {new Date(article.publishedAt).toLocaleDateString()}
                </p>
            )}
            <div
                style={{ marginTop: "1rem", lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
        </div>
    );
}

export default ArticleDetails;