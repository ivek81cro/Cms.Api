import api from "./client";

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    contentHtml: string;
    createdAt: string;
    publishedAt?: string | null;
    isPublished: boolean;
    galleryId?: number | null;
}

// Podaci koje koristi forma (create/edit)
export interface ArticleInput {
    title: string;
    slug: string;
    excerpt: string;
    contentHtml: string;
    isPublished: boolean;
    galleryId?: number | null;
}

export async function getArticles(): Promise<Article[]> {
    const res = await api.get<Article[]>("/articles");
    return res.data;
}

export async function getArticle(id: number): Promise<Article> {
    const res = await api.get<Article>(`/articles/${id}`);
    return res.data;
}

export async function createArticle(data: ArticleInput): Promise<Article> {
    const res = await api.post<Article>("/articles", data);
    return res.data;
}

export async function updateArticle(id: number, data: ArticleInput): Promise<void> {
    await api.put(`/articles/${id}`, data);
}

export async function deleteArticle(id: number): Promise<void> {
    await api.delete(`/articles/${id}`);
}
