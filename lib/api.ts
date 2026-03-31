import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send httpOnly cookies automatically
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || err.message || "Unexpected error";
    return Promise.reject(new Error(msg));
  }
);

// Auth
export const authAPI = {
  signup: (display_name: string, email: string, password: string) =>
    api.post("/auth/signup", { display_name, email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// Sessions
export const sessionsAPI = {
  list: () => api.get("/sessions"),
  get: (id: string) => api.get(`/sessions/${id}`),
  upload: (formData: FormData) =>
    api.post("/sessions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Weekly summary
export const summaryAPI = {
  latest: () => api.get("/summaries/latest"),
};
