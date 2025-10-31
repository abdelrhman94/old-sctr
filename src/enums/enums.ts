export enum UserType {
  Individual = 1,
  OrgAdmin = 2,
  SubUser = 3,
  Reviewer = 4,
  Manager = 5
}

export enum OrganizationType {
  CRO = 1,
  Hospital = 2,
  Pharmacy = 3,
  PharmaceuticalCompany = 4,
  HealthCenter = 5,
  Laboratory = 6,
  Other = 99
}

export enum JobTitle {
  Developer = 1,
  Researcher = 2
}

export enum UserNationality {
  Saudi = 1,
  Other = 2
}

export enum UserRole {
  INDIVIDUAL = "Individual",
  SUB_USER = "SubUser",
  ORGANIZATION_ADMIN = "OrganizationAdmin",
  DIRECTOR_MANAGER = "Manager",
  REVIEWER = "Reviewer"
}

export enum SiteRequirementsStatus {
  Notyetrecruiting = 1,
  Recruiting = 2,
  Active = 3,
  Notrecruiting = 4,
  Completed = 5,
  Suspended = 6,
  Terminated = 7,
  Withdrawn = 8
}

// Pretty labels (customize or localize with next-intl)
export const SiteRequirementsLabels: Record<SiteRequirementsStatus, string> = {
  [SiteRequirementsStatus.Notyetrecruiting]: "Not yet recruiting",
  [SiteRequirementsStatus.Recruiting]: "Recruiting",
  [SiteRequirementsStatus.Active]: "Active",
  [SiteRequirementsStatus.Notrecruiting]: "Not recruiting",
  [SiteRequirementsStatus.Completed]: "Completed",
  [SiteRequirementsStatus.Suspended]: "Suspended",
  [SiteRequirementsStatus.Terminated]: "Terminated",
  [SiteRequirementsStatus.Withdrawn]: "Withdrawn"
};

// Build <FormSelect> options
export const siteRequirementsOptions = ((): { label: string; value: number }[] => {
  return (Object.values(SiteRequirementsStatus) as number[])
    .filter((v) => typeof v === "number")
    .map((v) => ({ label: SiteRequirementsLabels[v as SiteRequirementsStatus], value: v }));
})();

export const REGISTRATION_USER_TYPES = {
  individual: UserType.Individual,
  organization: UserType.OrgAdmin
} as const;

export type RegistrationUserKey = keyof typeof REGISTRATION_USER_TYPES;

export const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  [OrganizationType.CRO]: "CRO",
  [OrganizationType.Hospital]: "Hospital",
  [OrganizationType.Pharmacy]: "Pharmacy",
  [OrganizationType.PharmaceuticalCompany]: "Pharmaceutical Company",
  [OrganizationType.HealthCenter]: "Health Center",
  [OrganizationType.Laboratory]: "Laboratory",
  [OrganizationType.Other]: "Other"
};

export enum EthicalApprovalStatus {
  NotYetSubmitted = 1,
  Submitted_Under_Review = 2,
  Submitted = 3,
  Approved = 4,
  NA = 5
}

export const EthicalApprovalLabels: Record<EthicalApprovalStatus, string> = {
  [EthicalApprovalStatus.NotYetSubmitted]: "Not yet submitted",
  [EthicalApprovalStatus.Submitted_Under_Review]: "Submitted (under review)",
  [EthicalApprovalStatus.Submitted]: "Submitted",
  [EthicalApprovalStatus.Approved]: "Approved",
  [EthicalApprovalStatus.NA]: "N/A"
};

// 3) Options for <FormSelect />
export const ethicalApprovalOptions: { label: string; value: number }[] = (
  Object.values(EthicalApprovalStatus).filter((v) => typeof v === "number") as number[]
).map((v) => ({
  value: v,
  label: EthicalApprovalLabels[v as EthicalApprovalStatus]
}));