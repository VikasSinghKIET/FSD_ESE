import api from "./api";

export const userService = {
  getAll: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};
