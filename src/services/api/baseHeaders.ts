export const buildHeaders = (options?: { json?: boolean }): HeadersInit => {
  const headers: HeadersInit = {
    "Accept-Language": localStorage.getItem("lang") ?? "en",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options?.json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};
