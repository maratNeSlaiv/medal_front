import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://127.0.0.1:8000";

async function getToken() {
  return await SecureStore.getItemAsync("jwt");
}

export async function signup(username, password, dob) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, dob }),
  });

  return await res.json();
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok && data.token) {
    await SecureStore.setItemAsync("jwt", data.token);
  }

  return data;
}

export async function resetPassword(username, oldPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  return await res.json();
}

export async function predictMole(imageUri) {
  const token = await getToken();

  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: "mole.jpg",
    type: "image/jpeg",
  });

  const res = await fetch(`${BASE_URL}/mole/predict`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  return await res.json();
}
