import axios from "axios";

// Create a custom axios instance (adjust baseURL if needed)
const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL}`,
  withCredentials: true, // needed if backend sets cookies!
});

// Request interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Refresh expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh ONCE per request!
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Try refresh token endpoint (your backend should issue new access token)
        const refreshRes = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshRes.data.accessToken;

        // Store new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update request header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request with new access token
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh failed—logout user locally (remove tokens) and redirect
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
