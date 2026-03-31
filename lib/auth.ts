import { authAPI } from "./api";

export async function signup(displayName: string, email: string, password: string) {
  const res = await authAPI.signup(displayName, email, password);
  // Token is set as httpOnly cookie by the server
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await authAPI.login(email, password);
  return res.data;
}

export async function logout() {
  await authAPI.logout();
  document.cookie = "speakup_token=; Max-Age=0; path=/";
}

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/speakup_token=([^;]+)/);
  return match ? match[1] : null;
}
