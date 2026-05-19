import api from "./api";

export const aiService = {
  analyze: (complaintId) =>
    api.post("/ai/analyze", { complaintId }).then((r) => r.data),

  analyzeRaw: (data) =>
    api.post("/ai/analyze-raw", data).then((r) => r.data),
};
