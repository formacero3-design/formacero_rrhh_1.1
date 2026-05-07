const normalizeUrl = (url) => {
  if (!url) return url;

  let normalized = url.trim();
  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  if (!normalized.endsWith("/api")) {
    normalized = `${normalized}/api`;
  }

  return normalized;
};

const buildApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return normalizeUrl(import.meta.env.VITE_API_URL);
  }

  if (typeof window === "undefined") {
    return "http://localhost:3001/api";
  }

  return "/api";
};

export const API = buildApiUrl();

export const getAuthHeaders = (customHeaders = {}, omitContentType = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...customHeaders
  };

  if (!omitContentType && headers["Content-Type"] === undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  const omitContentType = options.body instanceof FormData;
  return fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(options.headers, omitContentType)
    }
  });
};
