import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export interface AuthResponse {
    token: string;
    email: string;
    expiresAt: string;
}

interface AuthContextValue {
    userEmail: string | null;
    token: string | null;
    login: (auth: AuthResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // inicijalizacija iz localStorage – bez useEffect-a
    const [userEmail, setUserEmail] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("authEmail");
    });

    const [token, setToken] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("authToken");
    });

    function login(auth: AuthResponse) {
        setToken(auth.token);
        setUserEmail(auth.email);

        localStorage.setItem("authToken", auth.token);
        localStorage.setItem("authEmail", auth.email);
    }

    function logout() {
        setToken(null);
        setUserEmail(null);

        localStorage.removeItem("authToken");
        localStorage.removeItem("authEmail");
    }

    const value: AuthContextValue = {
        userEmail,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
