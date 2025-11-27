import { useEffect, useState } from "react";
import { type Article, getArticles } from "../api/articles";

export function ArticlesList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getArticles()
            .then(setArticles)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Uèitavanje...</p>;

    return (
        <div>
            <h1>Novosti</h1>
            {articles.map(a => (
                <article key={a.id} style={{ marginBottom: "1.5rem" }}>
                    <h2>{a.title}</h2>
                    <p>{a.excerpt}</p>
                </article>
            ))}
        </div>
    );
}
