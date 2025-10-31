export type PaginationRequest = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  parentId?: number;
  language?: string;
  studyType?: number;
  studyStatus?: number;
  date?: string;
  userType?: number;
  userStatus?: number;
  region?: number;
  city?: number;
};
