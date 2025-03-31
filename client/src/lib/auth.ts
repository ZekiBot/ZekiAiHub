import { apiRequest } from "./queryClient";

interface RegisterParams {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export async function register(params: RegisterParams) {
  const response = await apiRequest("POST", "/api/auth/register", params);
  return response.json();
}

export async function login(params: LoginParams) {
  const response = await apiRequest("POST", "/api/auth/login", params);
  return response.json();
}

export async function logout() {
  const response = await apiRequest("POST", "/api/auth/logout", {});
  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });
  
  if (!response.ok) {
    return null;
  }
  
  return response.json();
}

export async function googleLogin() {
  window.location.href = "/api/auth/google";
  // Returns a Promise that never resolves, as we're redirecting away
  return new Promise<void>(() => {});
}
