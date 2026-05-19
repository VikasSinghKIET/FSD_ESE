import api from "./api";

export const complaintService = {
  create: (data) => api.post("/complaints", data).then((r) => r.data),

  getAll: (params = {}) => api.get("/complaints", { params }).then((r) => r.data),

  getById: (id) => api.get(`/complaints/${id}`).then((r) => r.data),

  update: (id, data) => api.put(`/complaints/${id}`, data).then((r) => r.data),

  delete: (id) => api.delete(`/complaints/${id}`).then((r) => r.data),

  search: (params) => api.get("/complaints/search", { params }).then((r) => r.data),

  getStats: () => api.get("/complaints/stats").then((r) => r.data),
};
