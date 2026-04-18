// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

// export const request = async (
//   endpoint,
//   method = "GET",
//   body = null,
//   token = null,
// ) => {
//   const headers = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   try {
//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//       method,
//       headers,
//       body: body ? JSON.stringify(body) : null,
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       // Optional: handle unauthorized access
//       if (res.status === 401) {
//         console.warn("Unauthorized request:", endpoint);
//       }
//       throw new Error(data.error || data.message || "API Error");
//     }

//     return data;
//   } catch (err) {
//     console.error("API request failed:", err);
//     throw err; // re-throw so the caller can also handle it
//   }
// };


export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const request = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json(); // now should get proper JSON
  if (!res.ok) throw new Error(data.error || data.message || "API Error");
  return data;
};