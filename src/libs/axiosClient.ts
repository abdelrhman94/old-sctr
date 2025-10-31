// lib/axiosClient.ts
import axios from "axios";
import Cookies from "js-cookie";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  const locale = (Cookies.get("NEXT_LOCALE") ?? "en").toLowerCase();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = locale;
  // DO NOT set Content-Type for FormData — axios will add correct boundary
  return config;
});
