export interface StudiesResponse {
  studyId: string;
  sctR_RegistrationNumber: string;
  prospective: string;
  scientificTitle: string;
  registrantName: string;
  studyType: string;
  reviewerName: string;
  lastModification: string;
  status: string;
  director: string;
}

export interface StudyInitialDataResponse {
  studyId: string;
  recordNumber: string;
  sctR_RegistrationNumber: string;
  sctR_RegistrationDate: Date | string;
}

export interface SaveStudyBriefResponse {
  id: number;
}

export interface GetStudyBriefResponse {
  studyId: string;
  publicTitleAr: string;
  publicTitleEn: string;
  scientificTitle: string;
  acronym: string;
  secondaryIdentifyingNumbers: string;
}

export interface SaveStudyBriefRequest {
  studyId: string;
  isDraft: boolean;
  publicTitleAr: string;
  publicTitleEn: string;
  scientificTitle: string;
  acronym: string;
  secondaryIdentifyingNumbers: string;
}

export interface SaveStudyPlainSummaryResponse {
  id: number;
}

export interface SaveStudyPlainSummaryRequest {
  studyId: string;
  isDraft: boolean;
  plainSummaryAr: string;
  plainSummaryEn: string;
  keywords: string;
}

export interface GetStudyPlainSummaryResponse {
  studyId: string;
  plainSummaryAr: string;
  plainSummaryEn: string;
  keywords: string;
}

export interface SaveSiteInformationResponse {
  id: number;
}

export interface SaveSiteInformationRequest {
  studyId: string;
  isDraft?: boolean;
  regions: number;
  cities: number;
  siteNameAr: string;
  siteNameEn: string;
  piTitle: string;
  piFirstNme: string;
  piFamilyNme: string;
  piRegion: number;
  piCity: number;
  piContactForScientific: ContactInfo;
  piContactForPublic: ContactInfo;
  publicContact: ContactInfo;
  scientificContact: ContactInfo;
  siteRequirementsStatus: number;
}

export interface EthicsCommittee {
  name: string;
  email: string;
  phone: string;
}

export interface SaveEthicalApprovalRequest {
  studyId: string;
  isDraft?: boolean;
  ethicalApprovalStatus: number;
  ethicalApprovalStatusLabel?: string;
  dateOfSubmission: Date | undefined;
  dateOfApproval: Date | undefined;
  ethicsCommettees: EthicsCommittee[];
}

export interface SaveEthicalApprovalResponse {
  id: number;
}

export interface GetSiteInformationRequest {
  studyId: string;
  isDraft?: boolean;
  regions: number;
  regionsLabel?: string;
  cities: number;
  citiesLabel?: string;
  siteNameAr: string;
  siteNameEn: string;
  piTitle: string;
  piFirstNme: string;
  piFamilyNme: string;
  piRegion: number;
  piRegionLabel?: string;
  piCity: number;
  piCityLabel?: string;
  piContactForScientific: ContactInfo;
  piContactForPublic: ContactInfo;
  publicContact: ContactInfo;
  scientificContact: ContactInfo;
  siteRequirementsStatus: number;
  siteRequirementsStatusLabel?: string;
}

export interface ContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface SaveStudyInfoResponse {
  id: number;
}

export interface SaveStudyInfoRequest {
  studyId: string;
  isDraft?: boolean;
  protocolDate: Date | undefined;
  protocolNumber: string;
  version: string;
  studyStartDate: Date | undefined;
  studyEndDate: Date | undefined;
  followUpDuration: string;
  overallRecruitmentStatus: number;
  whyStudyStopped: number;
  whyStudyStoppedText: string;
  therapeuticArea: number;
  primaryDiseaseOrCondition: number;
  studyObjective: string;
  primaryOutcomeMeasure: OutcomeMeasure;
  secondaryOutcomeMeasure: OutcomeMeasure;
  fdaRegulatedProduct: number;
  typeOfSponsorship: number;
  isIndependentDataSafetyMonitoring: boolean;
  studyType: number;
  studyTypeText: string;
  studyObservational: StudyObservational;
  studyInterventional: StudyInterventional;
  overallRecruitmentStatusLabel?: string;
  whyStudyStoppedLabel?: string;
  therapeuticAreaLabel?: string;
  primaryDiseaseOrConditionLabel?: string;
  fdaRegulatedProductLabel?: string;
  typeOfSponsorshipLabel?: string;
  studyTypeLabel?: string;
}

export interface OutcomeMeasure {
  name: string;
  methodofTheMeasurement: string;
  time: string;
}

export interface ObservationalGroup {
  groupId: string;
  name: string;
  description: string;
}

export interface StudyObservational {
  observationalStudyModel: number;
  observationalStudyModelText: string;
  studyPurpose: number;
  studyPurposeText: string;
  timeProspective: number;
  timeProspectiveText: string;
  patientRegistryInformation: string;
  groups: ObservationalGroup[];
  groupCrossReference: string;
}

export interface StudyInterventional {
  primaryPurpose: number;
  primaryPurposeText: string;
  studyPhase: number;
  typeOfEndpoint: number;
  studyModel: number;
  studyModelText: string;
  randomization: number;
  methodOfRandomization: string;
  blinding: number;
  blindingText: string;
  armOrInterventionalCrossReference: string;
  arms: InterventionalArm[];
  interventions: InterventionsArray[];
}

export interface InterventionalArm {
  name: string;
  description: string;
  type: number;
}
export interface InterventionsArray {
  name: string;
  description: string;
  interventionType: number;
}

export interface SaveEligibilityResponse {
  id: number;
}

export interface SaveEligibilityRequest {
  studyId: string;
  isDraft?: boolean;
  participantType: number;
  participantTypeLabel?: string;
  ageLimit: string;
  participantGender: number;
  participantGenderLabel?: string;
  inclusionExclusion: string;
  locationOfStudy: number;
  locationOfStudyLabel?: string;
  targetInSaudi: number;
  targetSaudiLabel?: string;
  targetGlobal: number;
  targetGlobalLabel?: string;
  actualEnrolledSaudi: number;
  actualEnrolledSaudiLabel?: string;
  recruitmentStartSaudi: Date | undefined;
  recruitmentEndSaudi: Date | undefined;
  recruitmentStartGlobal: Date | undefined;
  recruitmentEndGlobal: Date | undefined;
}

export interface SaveSponsorsRequest {
  studyId: string;
  isDraft?: boolean;
  isThereAnySponsors: boolean;
  sponsorName: string;
  sponsorCountry: number;
  sponsorRegion: number;
  sponsorCity: number;
  sponsorPostcode: number;
  sponsorPhone: string;
  sponsorWebsite: string;
  sponsorDesignation: string;
  publicPhone: string;
  publicEmail: string;
  scientificPhone: string;
  scientificEmail: string;
}

export interface SaveSponsorsResponse {
  id: number;
}

export interface SaveCroRequest {
  studyId: string;
  isDraft?: boolean;
  isThereAnyCRO: boolean;
  name: string;
  country: number;
  region: number;
  city: number;
  postcode: number;
  tel: string;
  croWebsite: string;
  roleOrServices: number;
  otherRoleOrServices: string;
}

export interface SaveCroResponse {
  id: number;
}

export interface SaveCollaborationRequest {
  studyId: string;
  isDraft?: boolean;
  isThereAnyCollaboration: boolean;
  name: string;
  country: number;
  region: number;
  city: number;
  postcode: number;
  tel: string;
  website: string;
  designation: string;
  publicContact: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  scientificContact: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
}

export interface SaveCollaborationResponse {
  id: number;
}

export interface SaveFoundersRequest {
  studyId: string;
  isDraft: boolean;
  sources: number[];
  sourceText?: string;
  type: number[];
  typeText?: string;
}

export interface SaveFoundersResponse {
  id: number;
}

export interface SaveIPDRequest {
  studyId: string;
  isDraft: boolean;
  shareType?: number[];
  ipdSharingPlanDescription?: string;
  trialWebsite?: string;
  isIndividualParticipantsDataShared: number;
}

export interface SaveIPDResponse {
  id: number;
}
