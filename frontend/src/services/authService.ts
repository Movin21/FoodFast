export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const saveAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    return true; // Consider malformed tokens as expired
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
};

// Add this function to debug your auth token
export const debugAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }

  try {
    // Extract payload from JWT (without verifying signature)
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Token payload:", payload);

    // Check if token is expired
    const isExpired = payload.exp && payload.exp < Date.now() / 1000;
    console.log("Token expired:", isExpired);

    return {
      token: token.substring(0, 10) + "...",
      isExpired,
      expiresAt: payload.exp
        ? new Date(payload.exp * 1000).toLocaleString()
        : "unknown",
      user: payload.id,
      type: payload.type,
    };
  } catch (e) {
    console.error("Error parsing token:", e);
    return null;
  }
};
