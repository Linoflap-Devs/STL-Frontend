// utils/cookieUtils.ts

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Helper function to set a cookie
export function setCookie(name: string, value: string, days: number, p0: string) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`;

  // Store expiration timestamp in localStorage
  localStorage.setItem(`${name}_expires`, expires.getTime().toString());
}

export function isCookieExpired(name: string): boolean {
  const expires = localStorage.getItem(`${name}_expires`);
  if (!expires) return true;
  return Date.now() > parseInt(expires, 10);
}