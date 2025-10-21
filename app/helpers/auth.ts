import Constants from "expo-constants";

const authUrl = Constants.expoConfig?.extra?.authUrl;

async function fetchWrapper(url: string, options: RequestInit) {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
  
      if (!res.ok) {
        return { success: false, message: data.message || "Ошибка сервера" };
      }
  
      return { success: true, data };
    } catch (err) {
      return { success: false, message: "Нет подключения к интернету" };
    }
  }
  
  export async function registerUser(email: string, password: string) {
    return fetchWrapper(`${authUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }
  
  export async function loginUser(email: string, password: string) {
    return fetchWrapper(`${authUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }
  
  export async function forgotPassword(email: string) {
    return fetchWrapper(`${authUrl}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  }
  
  export async function getCurrentUser(token: string) {
    return fetchWrapper(`${authUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }