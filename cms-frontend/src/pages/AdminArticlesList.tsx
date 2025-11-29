import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type Article, getArticles, deleteArticle } from "../api/articles";
import { Container, Button, Table, Spinner, Alert, Badge } from "react-bootstrap";

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

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Admin – Članci</h1>
                <Button 
                    variant="warning"
                    onClick={() => navigate("/admin/articles/new")}
                >
                    + Novi članak
                </Button>
            </div>

            {articles.length === 0 ? (
                <Alert variant="info">Nema članaka.</Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped hover variant="dark" className="table-custom">
                        <thead>
                            <tr>
                                <th>Naslov</th>
                                <th>Status</th>
                                <th>Datum</th>
                                <th style={{width: '200px'}}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(a => (
                                <tr key={a.id}>
                                    <td>{a.title}</td>
                                    <td>
                                        {a.isPublished ? (
                                            <Badge bg="success">Objavljeno</Badge>
                                        ) : (
                                            <Badge bg="secondary">Skica</Badge>
                                        )}
                                    </td>
                                    <td>
                                        {a.publishedAt 
                                            ? new Date(a.publishedAt).toLocaleDateString('hr-HR')
                                            : '-'
                                        }
                                    </td>
                                    <td>
                                        <Link
                                            to={`/admin/articles/${a.id}`}
                                            className="btn btn-sm btn-outline-warning me-2"
                                        >
                                            Uredi
                                        </Link>
                                        <Button 
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(a.id)}
                                        >
                                            Obriši
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
}
