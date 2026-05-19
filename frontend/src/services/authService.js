import api from "./api";

export const authService = {
  signup: (data) => api.post("/auth/signup", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  getMe: () => api.get("/auth/me").then((r) => r.data),
  getAllUsers: () => api.get("/auth/users").then((r) => r.data),
  toggleUserStatus: (id) => api.put(`/auth/users/${id}/toggle`).then((r) => r.data),
};
