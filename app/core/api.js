import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./storage";

const BASE_URL = "http://127.0.0.1:8000";

export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  await saveTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

export async function apiFetch(endpoint, options = {}, logoutFn) {
  let accessToken = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    try {
      accessToken = await refreshAccessToken();

      const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return retryRes;
    } catch (err) {
      if (logoutFn) logoutFn();
      throw err;
    }
  }

  return res;
}

export async function register(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok && data.access_token) {
    await saveTokens(data.access_token, data.refresh_token);
  }

  return data;
}


export async function resetPassword(username, oldPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
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

export async function analyzeImageText(imageUri) {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "image.jpg",
    type: "image/jpeg",
  });

  const res = await fetch(`${BASE_URL}/ai/process-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();
  return data.summary;
}

export async function predictSkinLesion(imageUri) {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "mole.jpg",
    type: "image/jpeg",
  });  

  const res = await fetch(`${BASE_URL}/ai/skin_lesion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  return await res.json();
}

export async function generateMeal({
  dish_name,
  purpose,
  servings,
  cuisine,
  dietary_restrictions,
  max_cook_time,
  include_macros = false,
}) {
  if (!dish_name || !dish_name.trim()) {
    throw new Error("dish_name is required");
  }

  const token = await getAccessToken();

  const body = {
    dish_name,
    ...(purpose ? { purpose } : {}),
    ...(servings ? { servings } : {}),
    ...(cuisine ? { cuisine } : {}),
    ...(dietary_restrictions ? { dietary_restrictions } : {}),
    ...(max_cook_time ? { max_cook_time } : {}),
    include_macros,
  };

  const res = await fetch(`${BASE_URL}/diet/recipe_with_image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch meal: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function fetchSummary(texts) {
  const nonEmptyTexts = Object.values(texts).filter(t => t && t.trim());
  if (nonEmptyTexts.length === 0) {
    return "No analyzed texts available.";
  }

  const prompt = `You are a medical assistant. Summarize the following reports into a concise summary. 
Only mention abnormal or clinically significant results. If all results are normal, just say: "All results are within normal limits, no concerns." 
Reports:\n${nonEmptyTexts.join("\n\n")}`;

  try {
    const response = await fetchAIResponse([{ user: { _id: 1 }, text: prompt }]);
    return response;
  } catch (err) {
    console.error(err);
    return "Failed to generate summary.";
  }
}

export async function fetchAIResponse(history) {
  try {
    const messageText = history
      .map(m => `${m.user._id === 1 ? 'User' : 'AI'}: ${m.text}`)
      .join('\n');

    const response = await fetch('https://apifreellm.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return data.response;
    } else {
      console.error('AI Error:', data.error);
      return "Sorry, I couldn't respond.";
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    return "Error connecting to AI.";
  }
}
