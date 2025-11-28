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

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{isEditMode ? "Uredi članak" : "Novi članak"}</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        Naslov
                        <br />
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            onBlur={handleTitleBlur}
                            required
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        Slug (URL)
                        <br />
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            required
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        Kratki sažetak
                        <br />
                        <textarea
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleChange}
                            rows={3}
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        Sadržaj (HTML ili tekst)
                        <br />
                        <textarea
                            name="contentHtml"
                            value={form.contentHtml}
                            onChange={handleChange}
                            rows={10}
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "0.8rem" }}>
                    <label>
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={form.isPublished}
                            onChange={handleChange}
                        />{" "}
                        Objavljeno
                    </label>
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Spremam..." : "Spremi"}
                </button>
            </form>
        </div>
    );
}
