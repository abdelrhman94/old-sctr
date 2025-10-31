import { PaginationRequest } from "@/models/Request.model";
import { GeneralResponse, PaginationResponse } from "@/models/Response.model";
import { AssignReviewerRequest, ProcessApprovalRequest, UsersResponse } from "@/models/Users.model";



import { apiSlice } from "../slices/apiSlice";





export const usersApi = apiSlice.enhanceEndpoints({ addTagTypes: ["Users"] }).injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginationResponse<UsersResponse>, PaginationRequest>({
      query: (params) => ({
        url: "/User",
        params
      }),
      providesTags: ["Users"]
    }),
    assignReviewer: builder.mutation<GeneralResponse<string>, AssignReviewerRequest>({
      query: (body) => ({
        url: "/User/assign-reviewer",
        method: "POST",
        body: body
      }),
      invalidatesTags: ["Users"]
    }),
    processApprovalRequest: builder.mutation<GeneralResponse<string>, ProcessApprovalRequest>({
      query: (body) => ({
        url: "/User/process-approval-request",
        method: "POST",
        body: body
      }),
      invalidatesTags: ["Users"]
    })
  })
});

export const { useGetUsersQuery, useAssignReviewerMutation, useProcessApprovalRequestMutation } = usersApi;