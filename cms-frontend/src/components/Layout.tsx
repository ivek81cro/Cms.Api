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
        </div>
    );
}
