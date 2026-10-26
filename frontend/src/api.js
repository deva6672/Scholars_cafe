const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:5001/api`;

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function sendChatMessage(message, history) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  return handleResponse(res);
}

export async function fetchCafeInfo() {
  const res = await fetch(`${API_BASE_URL}/cafe-info`);
  return handleResponse(res);
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function fetchAdminData(token) {
  const res = await fetch(`${API_BASE_URL}/admin/data`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function updateAdminData(token, partialUpdate) {
  const res = await fetch(`${API_BASE_URL}/admin/data`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(partialUpdate),
  });
  return handleResponse(res);
}

export { API_BASE_URL };
