import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type Article, getArticles } from "../api/articles";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

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

    const published = articles.filter(a => a.isPublished);

    return (
        <>
            <section className="hero">
                <Container>
                    <h1>CMS TypeScrypt Demo</h1>
                    <p>Demo system for simple CMS</p>
                </Container>
            </section>

            <Container>
                <h2 className="mb-4">Najnovije Vijesti</h2>
                <Row>
                    {published.map(a => (
                        <Col key={a.id} xs={12} md={6} lg={4} className="mb-4">
                            <Card className="h-100 card-custom">
                                <Card.Body>
                                    <Card.Title>
                                        <Link to={`/articles/${a.id}`} className="text-decoration-none">
                                            {a.title}
                                        </Link>
                                    </Card.Title>
                                    {a.publishedAt && (
                                        <Card.Subtitle className="mb-2 text-secondary">
                                            {new Date(a.publishedAt).toLocaleDateString('hr-HR')}
                                        </Card.Subtitle>
                                    )}
                                    <Card.Text className="text-secondary">
                                        {a.excerpt}
                                    </Card.Text>
                                    <Link to={`/articles/${a.id}`} className="btn btn-outline-warning btn-sm">
                                        Pročitaj više →
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {published.length === 0 && (
                        <Col>
                            <p className="text-muted">Nema objavljenih članaka.</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
}