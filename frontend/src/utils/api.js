export const API_BASE = "http://localhost:3000/api";

export async function request(
  endpoint,
  method = "GET",
  body = null,
  token = null,
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Server did not return JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Server error");
  }

  return data;
}
