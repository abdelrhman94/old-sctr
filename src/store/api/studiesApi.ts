import { axiosClient } from "@/libs/axiosClient";
import { PaginationRequest } from "@/models/Request.model";
import { GeneralResponse, PaginationResponse } from "@/models/Response.model";
import { GetSiteInformationRequest, GetStudyBriefResponse, GetStudyPlainSummaryResponse, SaveCollaborationRequest, SaveCollaborationResponse, SaveCroRequest, SaveCroResponse, SaveEligibilityRequest, SaveEligibilityResponse, SaveEthicalApprovalRequest, SaveEthicalApprovalResponse, SaveFoundersRequest, SaveFoundersResponse, SaveIPDRequest, SaveIPDResponse, SaveSiteInformationRequest, SaveSiteInformationResponse, SaveSponsorsRequest, SaveSponsorsResponse, SaveStudyBriefRequest, SaveStudyBriefResponse, SaveStudyInfoRequest, SaveStudyInfoResponse, SaveStudyPlainSummaryRequest, SaveStudyPlainSummaryResponse, StudiesResponse, StudyInitialDataResponse } from "@/models/Studies.model";



import { apiSlice } from "../slices/apiSlice";





export const studiesApi = apiSlice.enhanceEndpoints({ addTagTypes: ["Studies"] }).injectEndpoints({
  endpoints: (builder) => ({
    getStudies: builder.query<PaginationResponse<StudiesResponse>, PaginationRequest>({
      query: (params) => ({
        url: "/Study",
        params
      }),
      providesTags: ["Studies"]
    }),
    deleteStudy: builder.mutation({
      query: ({ studyId }) => ({
        url: `/Study?StudyId=${studyId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Studies"]
    }),
    initiateStudy: builder.mutation<GeneralResponse<StudyInitialDataResponse>, any>({
      query: (credentials) => ({
        url: "/Study/Initiate",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    saveStudyBrief: builder.mutation<
      GeneralResponse<SaveStudyBriefResponse>,
      SaveStudyBriefRequest
    >({
      query: (credentials) => ({
        url: "/Study/SaveStudyBrief",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getStudyBrief: builder.query<GeneralResponse<GetStudyBriefResponse>, string>({
      query: (studyId) => ({
        url: `/Study/GetStudyBrief/${studyId}`
      })
    }),
    savePlainSummary: builder.mutation<
      GeneralResponse<SaveStudyPlainSummaryResponse>,
      SaveStudyPlainSummaryRequest
    >({
      query: (credentials) => ({
        url: "/Study/SavePlainSummary",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getPlainSummary: builder.query<GeneralResponse<GetStudyPlainSummaryResponse>, string>({
      query: (studyId) => ({
        url: `/Study/GetPlainSummary/${studyId}`
      })
    }),
    saveSiteInformation: builder.mutation<
      GeneralResponse<SaveSiteInformationResponse>,
      SaveSiteInformationRequest
    >({
      query: (credentials) => ({
        url: "/Study/SaveSiteInformation",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getSiteInformation: builder.query<GeneralResponse<GetSiteInformationRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetSiteInformation/${studyId}`
      })
    }),
    saveEthicalApproval: builder.mutation<
      GeneralResponse<SaveEthicalApprovalResponse>,
      SaveEthicalApprovalRequest
    >({
      query: (credentials) => ({
        url: "/Study/SaveEthicalApproval",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    uploadEthicalAttachment: builder.mutation<any, any>({
      async queryFn({ studyId, file }) {
        try {
          const fd = new FormData();
          fd.append("model", file, file.name); // the server requires 'model'

          const res = await axiosClient.post(
            `/Study/SaveEthicalApproval/Attachment/${studyId}`,
            fd,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );
          return { data: res.data };
        } catch (error: any) {
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data
            }
          };
        }
      }
    }),
    getEthicalApproval: builder.query<GeneralResponse<SaveEthicalApprovalRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetEthicalApproval/${studyId}`
      })
    }),
    saveStudyInfo: builder.mutation<GeneralResponse<SaveStudyInfoResponse>, SaveStudyInfoRequest>({
      query: (credentials) => ({
        url: "/Study/SaveStudyInformation",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getStudyInfo: builder.query<GeneralResponse<SaveStudyInfoRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetStudyInformation/${studyId}`
      })
    }),
    saveEligibility: builder.mutation<
      GeneralResponse<SaveEligibilityResponse>,
      SaveEligibilityRequest
    >({
      query: (credentials) => ({
        url: "/Study/SaveEligibility",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getEligibility: builder.query<GeneralResponse<SaveEligibilityRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetEligibility/${studyId}`
      })
    }),
    saveSponsors: builder.mutation<GeneralResponse<SaveSponsorsResponse>, SaveSponsorsRequest>({
      query: (credentials) => ({
        url: "/Study/SaveSponsors",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getSponsors: builder.query<GeneralResponse<SaveSponsorsRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetSponsors/${studyId}`
      })
    }),
    saveCro: builder.mutation<GeneralResponse<SaveCroResponse>, SaveCroRequest>({
      query: (credentials) => ({
        url: "/Study/SaveCro",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getCro: builder.query<GeneralResponse<SaveCroRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetCro/${studyId}`
      })
    }),
    saveCollaborations: builder.mutation<
      GeneralResponse<SaveCollaborationResponse>,
      SaveCollaborationRequest
    >({
      query: (credentials) => ({
        url: "/Study/SaveCollaborations",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getCollaborations: builder.query<GeneralResponse<SaveCollaborationRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetCollaborations/${studyId}`
      })
    }),
    saveFunders: builder.mutation<GeneralResponse<SaveFoundersResponse>, SaveFoundersRequest>({
      query: (credentials) => ({
        url: "/Study/SaveFunders",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getFunders: builder.query<GeneralResponse<SaveFoundersRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetFunders/${studyId}`
      })
    }),
    saveIPD: builder.mutation<GeneralResponse<SaveIPDResponse>, SaveIPDRequest>({
      query: (credentials) => ({
        url: "/Study/SaveIPD",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Studies"]
    }),
    getIPD: builder.query<GeneralResponse<SaveIPDRequest>, string>({
      query: (studyId) => ({
        url: `/Study/GetIPD/${studyId}`
      })
    }),
    submitStudy: builder.mutation<GeneralResponse<string>, string>({
      query: (studyId) => ({
        url: `/Study/Submit/${studyId}`,
        method: "POST"
      })
    })
  })
});

export const {
  useGetStudiesQuery,
  useDeleteStudyMutation,
  useInitiateStudyMutation,
  useSaveStudyBriefMutation,
  useGetStudyBriefQuery,
  useLazyGetStudyBriefQuery,
  useSavePlainSummaryMutation,
  useLazyGetPlainSummaryQuery,
  useSaveSiteInformationMutation,
  useLazyGetSiteInformationQuery,
  useSaveEthicalApprovalMutation,
  useUploadEthicalAttachmentMutation,
  useLazyGetEthicalApprovalQuery,
  useSaveStudyInfoMutation,
  useLazyGetStudyInfoQuery,
  useSaveEligibilityMutation,
  useLazyGetEligibilityQuery,
  useSaveSponsorsMutation,
  useLazyGetSponsorsQuery,
  useSaveCroMutation,
  useLazyGetCroQuery,
  useSaveCollaborationsMutation,
  useLazyGetCollaborationsQuery,
  useSaveFundersMutation,
  useLazyGetFundersQuery,
  useSaveIPDMutation,
  useLazyGetIPDQuery,
  useSubmitStudyMutation
} = studiesApi;