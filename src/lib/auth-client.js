import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { useSession, signOut } = authClient;

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;

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

export const signInAndGetToken = new Proxy(authClient.signIn, {
  get(target, prop) {
    if (typeof target[prop] === "function") {
      return async (...args) => {
        const result = await target[prop](...args);
        if (result?.data) {
          await getApiToken();
        }
        return result;
      };
    }
    return target[prop];
  },
});

