import { PaginationRequest } from "@/models/Request.model";
import { GeneralResponse, PaginationResponse } from "@/models/Response.model";
import { Lookups } from "@/models/lookups.model";



import { apiSlice } from "../slices/apiSlice";





export const lookupsApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Cities", "Regions", "Countries", "Organization", "OrganizationType"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCitiesLookups: builder.query<PaginationResponse<Lookups>, PaginationRequest>({
        query: (params) => ({
          url: "/Lookup/City",
          params
        }),
        providesTags: ["Cities"],
        extraOptions: { retry: 0 }
      }),
      getCountriesLookups: builder.query<PaginationResponse<Lookups>, PaginationRequest>({
        query: (params) => ({
          url: "/Lookup/country",
          params
        }),
        providesTags: ["Countries"],
        extraOptions: { retry: 0 }
      }),
      getRegionsLookups: builder.query<PaginationResponse<Lookups>, PaginationRequest>({
        query: (params) => ({
          url: "/Lookup/Region",
          params
        }),
        providesTags: ["Regions"],
        extraOptions: { retry: 0 }
      }),
      getOrganizationTypeLookups: builder.query<PaginationResponse<Lookups>, PaginationRequest>({
        query: (params) => ({
          url: "/Lookup/OrganizationType",
          params
        }),
        providesTags: ["OrganizationType"],
        extraOptions: { retry: 0 }
      }),
      getOrganizationLookups: builder.query<PaginationResponse<Lookups>, PaginationRequest>({
        query: (params) => ({
          url: "/Lookup/Organization",
          params
        }),
        providesTags: ["Organization"],
        extraOptions: { retry: 0 }
      }),
      getLookupByName: builder.query<GeneralResponse<any>, any>({
        query: ({ name }) => ({
          url: `/Lookup/enums?names=${name}`
        })
      })
    })
  });
export const {
  useGetCitiesLookupsQuery,
  useLazyGetCitiesLookupsQuery,
  useGetRegionsLookupsQuery,
  useLazyGetRegionsLookupsQuery,
  useGetCountriesLookupsQuery,
  useLazyGetCountriesLookupsQuery,
  useGetOrganizationTypeLookupsQuery,
  useGetLookupByNameQuery,
  useLazyGetOrganizationLookupsQuery
} = lookupsApi;