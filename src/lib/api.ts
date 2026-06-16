import axios from "axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(undefined);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthCall =
      originalRequest.url?.includes("/api/auth/me/") ||
      originalRequest.url?.includes("/api/auth/refresh/") ||
      originalRequest.url?.includes("/api/auth/login/") ||
      originalRequest.url?.includes("/api/auth/settings/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post("/api/auth/refresh/");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function extractMessages(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap(extractMessages);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(extractMessages);
  }
  return [];
}

function sanitize(msg: string): string {
  const clean = msg
    .replace(/^(ValidationError|IntegrityError|TypeError|ValueError|KeyError|AttributeError|Error):\s*/i, "")
    .replace(/\s+at\s+\w[\w./\\]+:\d+.*/s, "") // JS stack trace tail
    .replace(/Traceback \(most recent call last\)[\s\S]*/i, "")  // Python traceback
    .trim();

  // If it still looks like internal code return empty so the caller falls back
  if (/[{}<>]|undefined|None\b|null\b|traceback|stack/i.test(clean) || clean.length === 0) {
    return "";
  }
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function statusMessage(status: number): string {
  switch (status) {
    case 400: return "Please check your input and try again.";
    case 401: return "Your session has expired. Please log in again.";
    case 403: return "You don't have permission to do that.";
    case 404: return "The requested resource was not found.";
    case 405: return "This action isn't allowed here. Please refresh and try again.";
    case 408: return "The request timed out. Please try again.";
    case 409: return "A conflict occurred. The resource may already exist.";
    case 410: return "This resource is no longer available.";
    case 413: return "The file or data you sent is too large.";
    case 415: return "Unsupported file type.";
    case 422: return "The server couldn't process your request. Please check your input.";
    case 429: return "Too many requests. Please wait a moment and try again.";
    case 500: return "Server error. Please try again in a moment.";
    case 502: return "AI service is temporarily unavailable. Please try again in a moment.";
    case 503: return "AI service is temporarily unavailable. Please try again in a moment.";
    case 504: return "The request timed out. Please try again.";
    default:
      // Range-based fallbacks catch any code not listed above
      if (status >= 400 && status < 500) return "Request error. Please check your input and try again.";
      if (status >= 500 && status < 600) return "Server error. Please try again in a moment.";
      return "Something went wrong. Please try again.";
  }
}

export function parseBackendError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // No network response at all
    if (!error.response) {
      return "You appear to be offline. Check your connection and try again.";
    }

    const data = error.response?.data;
    const status = error.response?.status;

    // Try to pull human-readable messages out of the response body first
    if (data && typeof data === "object") {
      // Priority order: errors → error → detail → non_field_errors → message → whole body
      const candidates = [
        data.errors,
        data.error,
        data.detail,
        data.non_field_errors,
        data.message,
      ].filter(Boolean);

      for (const candidate of candidates) {
        const messages = extractMessages(candidate).map(sanitize).filter(Boolean);
        if (messages.length > 0) return messages.join(" ");
      }

      // Last resort: scan the entire body
      // (catches e.g. { "role": ["This field is required."] })
      const bodyMessages = extractMessages(data).map(sanitize).filter(Boolean);
      if (bodyMessages.length > 0) return bodyMessages.join(" ");
    }

    // Nothing useful in the body — fall back to the status code
    return statusMessage(status ?? 0);
  }

  // Non-Axios errors (e.g. thrown manually in hooks)
  if (error instanceof Error) {
    const clean = sanitize(error.message);
    return clean || "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export default api;