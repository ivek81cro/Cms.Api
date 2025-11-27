import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "1rem" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div>
                    <Link
                        to="/"
                        style={{ fontWeight: "bold", textDecoration: "none", color: "#4ea3ff" }}
                    >
                        CMS
                    </Link>
                </div>
                <nav style={{ display: "flex", gap: "0.75rem" }}>
                    <Link to="/" style={{ textDecoration: "none", color: "#4ea3ff" }}>
                        Članci
                    </Link>
                    <Link
                        to="/admin/articles"
                        style={{ textDecoration: "none", color: "#4ea3ff" }}
                    >
                        Admin – članci
                    </Link>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    );
}
