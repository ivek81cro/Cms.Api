import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesList } from "./pages/ArticlesList";
import { ArticleDetails } from "./pages/ArticleDetails";
import { AdminArticlesList } from "./pages/AdminArticlesList";
import { AdminArticleForm } from "./pages/AdminArticleForm";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { RequireAuth } from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout><ArticlesList /></Layout>} />
                    <Route path="/articles/:id" element={<Layout><ArticleDetails /></Layout>} />
                    <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                    <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
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
        </AuthProvider>
    </React.StrictMode>
);
