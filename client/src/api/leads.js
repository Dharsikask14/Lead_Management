import { http } from "./http.js";

export async function fetchLeads(params) {
  const { data } = await http.get("/leads", { params });
  return data;
}

export async function fetchLead(id) {
  const { data } = await http.get(`/leads/${id}`);
  return data.lead;
}

export async function createLead(payload) {
  const { data } = await http.post("/leads", payload);
  return data.lead;
}

export async function updateLead(id, payload) {
  const { data } = await http.patch(`/leads/${id}`, payload);
  return data.lead;
}

export async function deleteLead(id) {
  await http.delete(`/leads/${id}`);
}
