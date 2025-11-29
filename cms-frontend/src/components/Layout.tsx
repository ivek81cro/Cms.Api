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
                    <p>&copy; {new Date().getFullYear()} Bytelab - obrt</p>
                    <p>
                        <a href="mailto:info@motogymkhana.hr">hello@bytelab.hr</a>{" "}
                        |
                        <a href="tel:+3859985218101" style={{ marginLeft: "8px" }}>
                            +385 (0)99 852 1810
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
