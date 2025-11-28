import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7169/api", // port API
});

//Auth header if token exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;