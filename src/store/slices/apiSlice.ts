import { BaseQueryApi, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { getLocaleFromCookie } from "@/libs/getLocaleFromCookie";

import { logout } from "./authSlice";

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// Base API Query with Authorization Headers
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    const locale = getLocaleFromCookie();
    headers.set("Accept-Language", locale);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const refreshTokenRequest = async (api: BaseQueryApi) => {
  const refreshToken = Cookies.get("refreshToken");
  const token = Cookies.get("token");
  if (!refreshToken || !token) return null;
  const response = (await baseQuery(
    {
      url: "/auth/token/refresh",
      method: "POST",
      body: { refreshToken, token }
    },
    api,
    {}
  )) as { data?: RefreshTokenResponse };
  if (response.data) {
    Cookies.set("token", response.data.token, { secure: true });
    Cookies.set("refreshToken", response.data.refreshToken, { secure: true });
  }

  return response?.data || null;
};

export const authBaseQuery = async (args: any, api: BaseQueryApi, extraOptions = {}) => {
  let response = await baseQuery(args, api, extraOptions);

  if (response.error?.status === 401) {
    const newTokens = await refreshTokenRequest(api);

    if (newTokens) {
      response = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      window.location.href = "/login";
    }
  }

  return response;
};

export const apiSlice = createApi({
  reducerPath: "Saudi-NIH",
  baseQuery: authBaseQuery,
  endpoints: () => ({})
});
