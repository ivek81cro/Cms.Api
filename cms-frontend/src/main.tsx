import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesList } from "./pages/ArticlesList";
import { AdminArticlesList } from "./pages/AdminArticlesList";
import { AdminArticleForm } from "./pages/AdminArticleForm";
import { Layout } from "./components/Layout";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><ArticlesList /></Layout>} />
                <Route
                    path="/admin/articles"
                    element={<Layout><AdminArticlesList /></Layout>}
                />
                <Route
                    path="/admin/articles/new"
                    element={<Layout><AdminArticleForm /></Layout>}
                />
                <Route
                    path="/admin/articles/:id"
                    element={<Layout><AdminArticleForm /></Layout>}
                />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
