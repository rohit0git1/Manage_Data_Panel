import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export async function importRecords(records) {
  const res = await api.post("/records/import", { records });
  return res.data;
}

export async function getRecords(params, signal) {
  const res = await api.get("/records", { params, signal });
  return res.data;
}

export async function getSummary(signal) {
  const res = await api.get("/records/summary", { signal });
  return res.data;
}

export async function updateRecord(id, data) {
  const res = await api.put(`/records/${id}`, data);
  return res.data;
}

export async function deleteRecord(id) {
  const res = await api.delete(`/records/${id}`);
  return res.data;
}

export default api;
