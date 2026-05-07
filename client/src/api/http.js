import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

function getRequestUrl(error) {
  return error.config?.baseURL && error.config?.url
    ? `${error.config.baseURL.replace(/\/$/, "")}/${error.config.url.replace(/^\//, "")}`
    : error.config?.url || baseURL;
}

export function getApiError(error) {
  const data = error.response?.data;
  const requestUrl = getRequestUrl(error);

  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join(", ");
  }

  if (!error.response && error.request) {
    return (
      `Unable to connect to the API at ${requestUrl}. ` +
      "Make sure the backend server is running, the API URL is correct, and the client origin matches CORS settings."
    );
  }

  if (/network error/i.test(error.message)) {
    return (
      `Network error while connecting to ${requestUrl}. ` +
      "Check your server, browser network, and CORS settings."
    );
  }

  return data?.message || error.message || "Something went wrong";
}
