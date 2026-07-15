import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;

export async function getApiToken() {
  try {
    const res = await fetch("/api/auth/token");
    if (!res.ok) return null;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("better-auth-token", data.token);
    }
    return data.token;
  } catch {
    return null;
  }
}

export async function signInAndGetToken(...args) {
  const result = await signIn(...args);
  if (result?.data) {
    await getApiToken();
  }
  return result;
}

export async function signUpAndGetToken(...args) {
  const result = await signUp(...args);
  if (result?.data) {
    await getApiToken();
  }
  return result;
}
