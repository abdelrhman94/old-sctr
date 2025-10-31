import { PaginationRequest } from "@/models/Request.model";
import {
  AssignRequestReviewer,
  DecisionRequest,
  RequestsResponse,
  ReviewersResponse
} from "@/models/Requests.model";
import { GeneralResponse, PaginationResponse } from "@/models/Response.model";

import { apiSlice } from "../slices/apiSlice";

export const requestsApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Requests", "Reviewers"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getRequests: builder.query<PaginationResponse<RequestsResponse>, PaginationRequest>({
        query: (params) => ({
          url: "/Request",
          params
        }),
        providesTags: ["Requests"]
      }),
      getReviewers: builder.query<PaginationResponse<ReviewersResponse>, PaginationRequest>({
        query: (params) => ({
          url: "/Request/Reviewers",
          params
        }),
        providesTags: ["Reviewers"],
        extraOptions: { retry: 0 }
      }),
      assignRequestReviewer: builder.mutation<GeneralResponse<string>, AssignRequestReviewer>({
        query: (body) => ({
          url: "/Request/AssignReviewer",
          method: "POST",
          body: body
        }),
        invalidatesTags: ["Requests"]
      }),
      orgMangerDecision: builder.mutation<GeneralResponse<string>, DecisionRequest>({
        query: (body) => ({
          url: `/Request/OrgManagerDecision/${body.studyId}`,
          method: "POST",
          body: body
        }),
        invalidatesTags: ["Requests"]
      }),
      reviewerDecision: builder.mutation<GeneralResponse<string>, DecisionRequest>({
        query: (body) => ({
          url: `/Request/ReviewerDecision/${body.studyId}`,
          method: "POST",
          body: body
        }),
        invalidatesTags: ["Requests"]
      }),
      managerDecision: builder.mutation<GeneralResponse<string>, DecisionRequest>({
        query: (body) => ({
          url: `/Request/ManagerDecision/${body.studyId}`,
          method: "POST",
          body: body
        }),
        invalidatesTags: ["Requests"]
      })
    })
  });

export const {
  useGetRequestsQuery,
  useLazyGetReviewersQuery,
  useAssignRequestReviewerMutation,
  useOrgMangerDecisionMutation,
  useReviewerDecisionMutation,
  useManagerDecisionMutation
} = requestsApi;
