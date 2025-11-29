import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    type Article,
    type ArticleInput,
    getArticle,
    createArticle,
    updateArticle,
} from "../api/articles";

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

    if (loading) return <div className="container"><p>Učitavanje...</p></div>;
    if (error) return <div className="container"><p style={{color: 'var(--color-primary)'}}>{error}</p></div>;

    return (
        <div className="container" style={{ maxWidth: 900 }}>
            <h1>{isEditMode ? "Uredi članak" : "Novi članak"}</h1>

            <div style={{
                background: 'var(--color-bg-card)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            Naslov
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            onBlur={handleTitleBlur}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            Slug (URL)
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            Kratki sažetak
                        </label>
                        <textarea
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            Sadržaj (HTML ili tekst)
                        </label>
                        <textarea
                            name="contentHtml"
                            value={form.contentHtml}
                            onChange={handleChange}
                            rows={12}
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={form.isPublished}
                                onChange={handleChange}
                                style={{width: 'auto'}}
                            />
                            Objavljeno
                        </label>
                    </div>

                    <div style={{display: 'flex', gap: '12px'}}>
                        <button type="submit" disabled={saving}>
                            {saving ? "Spremam..." : "Spremi"}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate("/admin/articles")}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)'
                            }}
                        >
                            Odustani
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
