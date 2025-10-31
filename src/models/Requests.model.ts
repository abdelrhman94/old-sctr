export interface RequestsResponse {
  studyId: string;
  studyName: string;
  recordNumber: string;
  status: string;
}

export interface ReviewersResponse {
  id: number;
  nameEn: string;
  nameAr: string;
  assignedStudiesCount: number;
}

export interface AssignRequestReviewer {
  studyId: string;
  reviewerUserId: string | number;
}

export interface DecisionRequest {
studyId: string;
isApproved: boolean;
comment: string;
}