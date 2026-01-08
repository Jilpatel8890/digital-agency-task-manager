const API_BASE = "http://localhost:5000/api/users";

export const fetchUsers = async (token) => {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Failed to fetch users";
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      errorMessage = `Request failed with status ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const createUser = async (data, token) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to create user";
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      // If response is not JSON (e.g., HTML 404 page)
      errorMessage = `Request failed with status ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const updateUser = async (id, data, token) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to update user";
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      errorMessage = `Request failed with status ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const deleteUser = async (id, token) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Failed to delete user";
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      errorMessage = `Request failed with status ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

