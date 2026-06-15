import axios from "axios";

// const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api" });
const api = axios.create({ baseURL: "https://geetadhyajewels-api.onrender.com/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gjToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Add CSRF token if available (from meta tag or local storage)
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || localStorage.getItem("_csrf");
  if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  // Set secure headers
  config.headers["X-Requested-With"] = "XMLHttpRequest";

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("gjToken");
      localStorage.removeItem("gjUser");
      const isAdmin = window.location.pathname.startsWith("/admin");
      const loginPath = isAdmin ? "/admin/login" : "/login";
      if (!window.location.pathname.endsWith("/login")) {
        window.location.replace(loginPath);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
