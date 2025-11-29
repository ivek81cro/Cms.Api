import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    type Article,
    type ArticleInput,
    getArticle,
    createArticle,
    updateArticle,
} from "../api/articles";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");
}

export function AdminArticleForm() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState<ArticleInput>({
        title: "",
        slug: "",
        excerpt: "",
        contentHtml: "",
        isPublished: false,
        galleryId: undefined,
    });

    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Učitaj članak u edit modu
    useEffect(() => {
        if (!isEditMode) return;

        const articleId = Number(id);
        if (isNaN(articleId)) {
            setError("Neispravan ID članka.");
            setLoading(false);
            return;
        }

        getArticle(articleId)
            .then((a: Article) => {
                setForm({
                    title: a.title,
                    slug: a.slug,
                    excerpt: a.excerpt,
                    contentHtml: a.contentHtml,
                    isPublished: a.isPublished,
                    galleryId: a.galleryId ?? undefined,
                });
            })
            .catch(err => {
                console.error(err);
                setError("Greška kod učitavanja članka.");
            })
            .finally(() => setLoading(false));
    }, [id, isEditMode]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleTitleBlur = () => {
        if (!form.slug && form.title) {
            setForm(prev => ({ ...prev, slug: slugify(prev.title) }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (isEditMode && id) {
                await updateArticle(Number(id), form);
            } else {
                await createArticle(form);
            }
            navigate("/admin/articles");
        } catch (err) {
            console.error(err);
            setError("Greška kod spremanja članka.");
        } finally {
            setSaving(false);
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
    
    if (error && !saving) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container style={{ maxWidth: 900 }}>
            <h1 className="mb-4">{isEditMode ? "Uredi članak" : "Novi članak"}</h1>

            <Card className="card-custom">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Naslov</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                onBlur={handleTitleBlur}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSlug">
                            <Form.Label>Slug (URL)</Form.Label>
                            <Form.Control
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                Automatski se generira iz naslova
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formExcerpt">
                            <Form.Label>Kratki sažetak</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="excerpt"
                                value={form.excerpt}
                                onChange={handleChange}
                                rows={3}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formContent">
                            <Form.Label>Sadržaj (HTML ili tekst)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="contentHtml"
                                value={form.contentHtml}
                                onChange={handleChange}
                                rows={12}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formPublished">
                            <Form.Check
                                type="checkbox"
                                name="isPublished"
                                label="Objavljeno"
                                checked={form.isPublished}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                        <div className="d-flex gap-2">
                            <Button 
                                variant="warning" 
                                type="submit" 
                                disabled={saving}
                            >
                                {saving ? "Spremam..." : "Spremi"}
                            </Button>
                            <Button 
                                variant="secondary"
                                type="button" 
                                onClick={() => navigate("/admin/articles")}
                            >
                                Odustani
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
