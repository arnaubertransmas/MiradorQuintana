const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getRole() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ROLE_KEY);
}

export function setSession(token, role) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

export function dashboardPathForRole(role) {
  return role === 'admin' ? '/admin' : '/cuina';
}
