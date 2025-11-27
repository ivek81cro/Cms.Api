import api from "./client";

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    contentHtml: string;
    createdAt: string;
    publishedAt?: string;
    isPublished: boolean;
    galleryId?: number;
}

export async function getArticles(): Promise<Article[]> {
    const res = await api.get<Article[]>("/articles");
    return res.data;
}