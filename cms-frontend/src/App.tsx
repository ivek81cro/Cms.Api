import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesList } from "./pages/ArticlesList";
import { AdminArticlesList } from "./pages/AdminArticlesList";
import { AdminArticleForm } from "./pages/AdminArticleForm";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RequireAuth } from "./auth/RequireAuth";
import "./index.css";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><ArticlesList /></Layout>} />
                <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                <Route
                    path="/admin/articles"
                    element={
                        <RequireAuth>
                            <Layout><AdminArticlesList /></Layout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/articles/new"
                    element={
                        <RequireAuth>
                            <Layout><AdminArticleForm /></Layout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin/articles/:id"
                    element={
                        <RequireAuth>
                            <Layout><AdminArticleForm /></Layout>
                        </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
