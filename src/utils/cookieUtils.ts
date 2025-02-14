// utils/cookieUtils.ts
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  
// Helper function to set a cookie
export function setCookie(name: any, value: any, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration in ms
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; HttpOnly; SameSite=Strict`;
}