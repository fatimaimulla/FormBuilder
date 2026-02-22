export const AUTH_ACCESS_TOKEN_KEY = "formbuilder_access_token";
export const AUTH_USER_KEY = "formbuilder_user";

export function getStoredAccessToken() {
  return localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession({ accessToken, user }) {
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearSessionStorage() {
  localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
