import { http } from "./http.js";

export async function registerUser(payload) {
  const { data } = await http.post("/auth/register", payload);
  return data.user;
}

export async function loginUser(payload) {
  const { data } = await http.post("/auth/login", payload);
  return data.user;
}

export async function fetchCurrentUser() {
  const { data } = await http.get("/auth/me");
  return data.user;
}

export async function logoutUser() {
  await http.post("/auth/logout");
}

export async function deleteAccount() {
  await http.delete("/auth/account");
}
