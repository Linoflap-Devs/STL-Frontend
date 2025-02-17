// utils/cookieUtils.ts

export function getRefreshTokenFromCookie(p0: string) {
  const cookieName = 'refreshToken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return '';
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