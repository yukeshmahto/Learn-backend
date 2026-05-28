import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const API_USE_CREDENTIALS = import.meta.env.VITE_API_USE_CREDENTIALS === "true";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000;
const AUTH_STORAGE_KEY = "backendLearnAuth";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: API_USE_CREDENTIALS,
  timeout: API_TIMEOUT,
  headers: {
    Accept: "application/json",
  },
});

const readAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

const writeAuth = (value) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

api.interceptors.request.use((config) => {
  const auth = readAuth();
  if (auth?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const auth = readAuth();
      if (!auth?.refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/refresh-token`,
          { refreshToken: auth.refreshToken },
        );
        const newTokens = response.data?.data;
        if (newTokens?.accessToken) {
          const updatedAuth = {
            ...auth,
            ...newTokens,
          };
          writeAuth(updatedAuth);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { api, readAuth, writeAuth, clearAuth, AUTH_STORAGE_KEY };
