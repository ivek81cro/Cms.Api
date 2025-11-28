import axios from "axios";

function getBaseUrl() {
    // Set in .env or .env.development as VITE_API_BASE_URL
    const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
    return fromEnv?.replace(/\/+$/, "") ?? "https://localhost:7169/api";
}

function isValidJwt(token: string): boolean {
    try {
        const [, payloadB64] = token.split(".");
        if (!payloadB64) return false;
        const payloadJson = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
        if (typeof payloadJson.exp !== "number") return true; // no exp => treat as valid
        const now = Math.floor(Date.now() / 1000);
        return payloadJson.exp > now;
    } catch {
        return false;
    }
}

const api = axios.create({
    baseURL: getBaseUrl(),
});

//Auth header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token && isValidJwt(token)) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    } else if (token && !isValidJwt(token)) {
        // cleanup expired/invalid token so public endpoints don't get 401
        localStorage.removeItem("authToken");
        localStorage.removeItem("authEmail");
    }
    return config;
});

export default api;