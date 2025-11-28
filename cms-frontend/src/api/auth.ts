import api from "./client";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    expiresAt: string;
    email: string;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", request);
    return res.data;
}
