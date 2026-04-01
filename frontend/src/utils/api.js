const API_URL = "http://localhost:3000/api";

// reusable request function
export const request = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
