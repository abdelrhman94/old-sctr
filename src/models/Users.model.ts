export interface UsersResponse {
  id: string;
  fullName: string;
  email: string;
  userTypeText: string;
  userType: number;
  creationDate: Date | string;
  isApproved: boolean;
  isActive: boolean;
}

export interface AssignReviewerRequest {
  userId: string;
  assignedUserId: string | number;
}

export interface ProcessApprovalRequest {
  approvalRequestId: string;
  comments?: string;
  isApproved: boolean;
}