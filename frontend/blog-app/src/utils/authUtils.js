export const isTokenExpired = (token) => {
  if (!token) return true;

  const payloadBase64Url = token.split(".")[1];
  if (!payloadBase64Url) return true;

  const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payloadJson = atob(payloadBase64);
  const payload = JSON.parse(payloadJson);

  return payload.exp && payload.exp < Math.floor(Date.now() / 1000);
};

const API_BASE_URL = "http://localhost:8000";

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    return data.access; // Return the new access token
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error; // Rethrow the error for handling in components
  }
};
