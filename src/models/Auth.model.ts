export interface LoginResponse {
  id: string;
  email: string;
  userName: string;
  nationalId: string;
  firstNameEn: string;
  secondNameEn: string;
  familyNameEn: string;
  firstNameAr: string;
  secondNameAr: string;
  familyNameAr: string;
  userType: number;
  isApproved: boolean;
  roles: string[];
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface PreRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userType: number;
}

export interface PreRegisterResponse {
  id: string;
}

export interface IdentityValidationRequest {
  idNumber: string;
  dateofbirth: Date | undefined;
}

export interface IdentityValidationResponse {
  firstNameAr: string;
  secondNameAr: string;
  familyNameAr: string;
  firstNameEn: string;
  secondNameEn: string;
  familyNameEn: string;
  idNumber: string;
  dob: Date | undefined;
}
export interface RegisterRequest {
  idNumber: string;
  dob: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationId: string;
  address1: string;
  address2: string;
  postalCode: number;
  region: number;
  city: number;
  mobileNumber: string;
  jobTitle: number;
  jobTitleText: string;
  department: string;
  currentSite: string;
}

export interface OrgInfoRequest {
  organizationType: string;
  region: number;
  city: number;
  nameAr: string;
  nameEn: string;
  website: string;
}

export interface OrgInfoResponse {
  id: string;
}
