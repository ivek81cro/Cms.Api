import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:5001/api", // ili port od tvog API-ja
});

export default api;