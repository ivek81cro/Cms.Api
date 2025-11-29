import type { ReactNode } from "react";
import { NavBar } from "./Navbar/NavBar";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="layout">
            <NavBar />
            <main className="layout__main">
                {children}
            </main>
            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Moto Gymkhana Croatia. Sva prava pridržana.</p>
                    <p>
                        <a href="mailto:info@motogymkhana.hr">info@motogymkhana.hr</a>{" "}
                        |
                        <a href="tel:+385992360091" style={{ marginLeft: "8px" }}>
                            +385 (0)99 236 0091
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
