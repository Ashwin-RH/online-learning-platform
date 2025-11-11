// Read and decode the stored token safely
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload; // { id, role, iat, exp }
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const isAuthenticated = () => !!localStorage.getItem("token");
