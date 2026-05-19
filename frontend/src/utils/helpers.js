export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const truncate = (str, max = 80) =>
  str?.length > max ? str.slice(0, max) + "…" : str;

export const getStatusClass = (status) => {
  const map = {
    Pending: "badge-pending",
    "In Progress": "badge-progress",
    Resolved: "badge-resolved",
    Rejected: "badge-rejected",
  };
  return map[status] || "badge-pending";
};

export const getPriorityClass = (priority) => {
  const map = {
    Low: "badge-low",
    Medium: "badge-medium",
    High: "badge-high",
  };
  return map[priority] || "badge-medium";
};

export const CATEGORIES = [
  "Water Supply",
  "Electricity",
  "Garbage & Sanitation",
  "Roads & Infrastructure",
  "Public Safety",
  "Healthcare",
  "Education",
  "Other",
];

export const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

export const downloadCSV = (data, filename = "complaints.csv") => {
  if (!data?.length) return;
  const headers = ["Title", "Category", "Location", "Status", "Name", "Email", "Date"];
  const rows = data.map((c) => [
    `"${c.title}"`, c.category, c.location, c.status,
    c.name, c.email, formatDate(c.createdAt),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
