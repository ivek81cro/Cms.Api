import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { type Article, getArticle } from "../api/articles";
import { Container, Spinner, Alert, Badge } from "react-bootstrap";

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

    if (isInvalidId) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Neispravan ID članka.</Alert>
            </Container>
        );
    }
    
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3">Učitavanje...</p>
            </Container>
        );
    }
    
    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }
    
    if (!article) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">Članak nije pronađen.</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Link to="/" className="btn btn-outline-warning btn-sm mb-3">
                ← Natrag na članke
            </Link>
            
            <h1 className="mb-3">{article.title}</h1>
            
            {article.publishedAt && (
                <p className="text-muted mb-4">
                    <Badge bg="secondary">
                        {new Date(article.publishedAt).toLocaleDateString('hr-HR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Badge>
                </p>
            )}
            
            <div className="article-details" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </Container>
    );
}

export default ArticleDetails;