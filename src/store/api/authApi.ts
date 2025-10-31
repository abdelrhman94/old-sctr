import { ForgotPasswordRequest, IdentityValidationRequest, IdentityValidationResponse, LoginRequest, LoginResponse, OrgInfoRequest, OrgInfoResponse, PreRegisterRequest, PreRegisterResponse, RegisterRequest, ResetPasswordRequest } from "@/models/Auth.model";
import { GeneralResponse } from "@/models/Response.model";



import { apiSlice } from "../slices/apiSlice";





export const authApi = apiSlice.enhanceEndpoints({ addTagTypes: ["Login"] }).injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<GeneralResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      })
    }),
    forgotPassword: builder.mutation<GeneralResponse<string>, ForgotPasswordRequest>({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials
      })
    }),
    resetPassword: builder.mutation<GeneralResponse<string>, ResetPasswordRequest>({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credentials
      })
    }),
    preRegister: builder.mutation<GeneralResponse<PreRegisterResponse>, PreRegisterRequest>({
      query: (credentials) => ({
        url: "/Registration/PreRegisteration",
        method: "POST",
        body: credentials
      })
    }),
    identityValidation: builder.mutation<
      GeneralResponse<IdentityValidationResponse>,
      IdentityValidationRequest
    >({
      query: (credentials) => ({
        url: "/Registration/IdentityValidation",
        method: "POST",
        body: credentials
      })
    }),
    orgInfo: builder.mutation<GeneralResponse<OrgInfoResponse>, OrgInfoRequest>({
      query: (credentials) => ({
        url: "/Registration/organization/info",
        method: "POST",
        body: credentials
      })
    }),
    register: builder.mutation<GeneralResponse<string>, RegisterRequest>({
      query: (credentials) => ({
        url: "/Registration/Register",
        method: "POST",
        body: credentials
      })
    }),
    registerSubUser: builder.mutation<GeneralResponse<string>, RegisterRequest>({
      query: (credentials) => ({
        url: "/Registration/subuser",
        method: "POST",
        body: credentials
      })
    }),
    confirmEmail: builder.mutation({
      query: (params) => ({
        url: "/auth/confirm-email",
        method: "POST",
        body: params
      })
    }),
    resendConfirmEmail: builder.mutation({
      query: (email) => ({
        url: `/auth/resend-email-confirmation?email=${email}`,
        method: "POST",
      })
    })
  })
});

export const {
  useLoginMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  usePreRegisterMutation,
  useIdentityValidationMutation,
  useOrgInfoMutation,
  useRegisterMutation,
  useRegisterSubUserMutation,
  useConfirmEmailMutation,
  useResendConfirmEmailMutation
} = authApi;