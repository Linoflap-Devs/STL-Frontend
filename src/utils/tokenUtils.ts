// utils/tokenUtils.ts

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
    const expired = decodedToken.exp * 1000 < Date.now(); // Check if the token is expired
    console.log(`Token expired: ${expired}`);
    return expired;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; 
  }
};