import { z } from "zod";

import { EthicalApprovalStatus } from "@/enums/enums";
import {
  ArabicText,
  ContactInfo,
  Email,
  EnglishText,
  FileAttachment,
  Phone,
  PositiveInteger,
  RequiredNumber,
  RequiredString,
  ValidDate,
  Website
} from "@/schemas/sharedSchemas";

export const StudyBriefSchema = z.object({
  studyId: RequiredString,
  recordNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  dateOfRegistration: z.string().optional(),
  publicTitleAr: ArabicText,
  publicTitleEn: EnglishText,
  scientificTitle: RequiredString,
  acronym: RequiredString,
  secondaryIdentifyingNumbers: RequiredString.regex(/^\d+$/, "Numbers only")
});

export const SaveIPDSchema = z
  .object({
    studyId: RequiredString,
    isIndividualParticipantsDataShared: RequiredNumber,
    ipdSharingPlanDescription: z.string().optional(),
    shareType: z.array(z.number()).optional(),
    trialWebsite: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.isIndividualParticipantsDataShared === 1) {
      // description required
      if (!data.ipdSharingPlanDescription?.trim()) {
        ctx.addIssue({
          path: ["ipdSharingPlanDescription"],
          code: "custom",
          message: "Please provide a description for the sharing plan"
        });
      }

      // at least one share type required
      if (!Array.isArray(data.shareType) || data.shareType.length === 0) {
        ctx.addIssue({
          path: ["shareType"],
          code: "custom",
          message: "Select at least one supporting information type"
        });
      }

      // trial website required (and must be a valid URL)
      const url = data.trialWebsite?.trim();
      if (!url) {
        ctx.addIssue({
          path: ["trialWebsite"],
          code: "custom",
          message: "Trial website is required"
        });
      } else {
        try {
          // Basic URL validity check
          // (accepts http/https; tweak if you want to allow bare domains)
          const u = new URL(url);
          if (!/^https?:$/i.test(u.protocol)) {
            throw new Error("not http(s)");
          }
        } catch {
          ctx.addIssue({
            path: ["trialWebsite"],
            code: "custom",
            message: "Enter a valid URL (e.g., https://example.com)"
          });
        }
      }
    }
  });

export const PlainSummarySchema = z.object({
  studyId: RequiredString,
  plainSummaryAr: ArabicText,
  plainSummaryEn: EnglishText,
  keywords: RequiredString
});

export const SiteInfoSchema = z.object({
  studyId: RequiredString,
  regions: PositiveInteger("regions"),
  cities: PositiveInteger("cities"),
  siteNameAr: ArabicText,
  siteNameEn: EnglishText,
  piTitle: RequiredString,
  piFirstNme: RequiredString,
  piFamilyNme: RequiredString,
  piRegion: PositiveInteger("piRegion"),
  piCity: PositiveInteger("piCity"),
  piContactForScientific: ContactInfo,
  piContactForPublic: ContactInfo,
  publicContact: ContactInfo,
  scientificContact: ContactInfo,
  siteRequirementsStatus: RequiredNumber
});

const CommitteeSchema = z.object({
  name: RequiredString,
  email: Email,
  phone: Phone
});

export const EthicalApprovalFormSchema = z
  .object({
    studyId: RequiredString,
    ethicalApprovalStatus: RequiredNumber,
    dateOfSubmission: ValidDate,
    dateOfApproval: ValidDate,
    ethicsCommettees: z.array(CommitteeSchema).min(1, "At least one committee"),
    attachment: FileAttachment.optional()
  })
  .superRefine((val, ctx) => {
    if (val.ethicalApprovalStatus === EthicalApprovalStatus.Approved) {
      if (!val.attachment) {
        ctx.addIssue({
          code: "custom",
          path: ["attachment"],
          message: "Upload the approval file when status is Approved"
        });
      }
    }
    if (val.dateOfSubmission && val.dateOfApproval) {
      if (val.dateOfSubmission.getTime() > val.dateOfApproval.getTime()) {
        ctx.addIssue({
          code: "custom",
          path: ["dateOfApproval"],
          message: "Date of Approval must be on or after Date of Submission"
        });
      }
    }
  });

export const OutcomeMeasureSchema = z.object({
  name: RequiredString,
  methodofTheMeasurement: RequiredString,
  time: RequiredString
});

export const ObservationalGroupSchema = z.object({
  groupId: RequiredString,
  name: RequiredString,
  description: RequiredString
});

export const StudyObservationalSchema = z.object({
  observationalStudyModel: RequiredNumber,
  observationalStudyModelText: RequiredString,
  studyPurpose: RequiredNumber,
  studyPurposeText: RequiredString,
  timeProspective: RequiredNumber,
  timeProspectiveText: RequiredString,
  patientRegistryInformation: RequiredString,
  groups: z.any().optional(),
  groupCrossReference: RequiredString
});

export const StudyInterventionalSchema = z.object({
  primaryPurpose: RequiredNumber,
  primaryPurposeText: RequiredString,
  studyPhase: RequiredNumber,
  typeOfEndpoint: RequiredNumber,
  studyModel: RequiredNumber,
  studyModelText: RequiredString,
  randomization: RequiredNumber,
  methodOfRandomization: RequiredString
});

export const StudyInfoFormSchema = z
  .object({
    studyId: RequiredString,
    protocolDate: ValidDate,
    protocolNumber: RequiredString.regex(/^\d{7}$/, "Must be exactly 7 digits"),
    version: RequiredString,
    studyStartDate: ValidDate,
    studyEndDate: ValidDate,
    followUpDuration: RequiredString,
    overallRecruitmentStatus: RequiredNumber,
    whyStudyStopped: RequiredNumber,
    whyStudyStoppedText: RequiredString,
    therapeuticArea: RequiredNumber,
    primaryDiseaseOrCondition: RequiredNumber,
    studyObjective: RequiredString,
    primaryOutcomeMeasure: OutcomeMeasureSchema,
    secondaryOutcomeMeasure: OutcomeMeasureSchema,
    fdaRegulatedProduct: RequiredNumber,
    typeOfSponsorship: RequiredNumber,
    isIndependentDataSafetyMonitoring: z.boolean().optional(),
    studyType: RequiredNumber,
    studyTypeText: RequiredString,
    studyObservational: StudyObservationalSchema.optional(),
    studyInterventional: StudyInterventionalSchema.optional()
  })
  .superRefine((val, ctx) => {
    // Dates: start <= end
    if (val.studyStartDate.getTime() > val.studyEndDate.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["studyEndDate"],
        message: "Study end date must be on or after study start date"
      });
    }

    // (Optional) Protocol date before or on start date
    if (val.protocolDate.getTime() > val.studyStartDate.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["protocolDate"],
        message: "Protocol date should be on or before study start date"
      });
    }

    // If you know the studyType codes, enforce the proper block:
    // Example: 1 = Interventional, 2 = Observational (change to your real codes)
    const INTERVENTIONAL = 5;
    const OBSERVATIONAL = 1;

    if (val.studyType === INTERVENTIONAL && !val.studyInterventional) {
      ctx.addIssue({
        code: "custom",
        path: ["studyInterventional"],
        message: "Interventional details are required for an interventional study"
      });
    }
    if (val.studyType === OBSERVATIONAL && !val.studyObservational) {
      ctx.addIssue({
        code: "custom",
        path: ["studyObservational"],
        message: "Observational details are required for an observational study"
      });
    }
  });

export const EligibilitySchema = z.object({
  studyId: RequiredString,
  participantType: RequiredNumber,
  ageLimit: RequiredString.regex(/^\d{2}$/, "Must be exactly 2 digits"),
  participantGender: RequiredNumber,
  inclusionExclusion: RequiredString,
  locationOfStudy: RequiredNumber,
  targetInSaudi: RequiredNumber,
  targetGlobal: RequiredNumber,
  actualEnrolledSaudi: RequiredNumber,
  recruitmentStartSaudi: ValidDate,
  recruitmentEndSaudi: ValidDate,
  recruitmentStartGlobal: ValidDate,
  recruitmentEndGlobal: ValidDate
});

export const SponsorsSchema = z.discriminatedUnion("isThereAnySponsors", [
  z.object({
    studyId: RequiredString,
    isThereAnySponsors: z.literal(false),
    sponsorName: z.any(),
    sponsorCountry: z.any(),
    sponsorRegion: z.any(),
    sponsorCity: z.any(),
    sponsorPostcode: z.any(),
    sponsorPhone: z.any(),
    sponsorWebsite: z.any(),
    sponsorDesignation: z.any(),
    publicPhone: z.any(),
    publicEmail: z.any(),
    scientificPhone: z.any(),
    scientificEmail: z.any()
  }),
  z.object({
    studyId: RequiredString,
    isThereAnySponsors: z.literal(true),
    sponsorName: RequiredString,
    sponsorCountry: PositiveInteger("sponsorCountry"),
    sponsorRegion: PositiveInteger("sponsorRegion"),
    sponsorCity: PositiveInteger("sponsorCity"),
    sponsorPostcode: PositiveInteger("sponsorPostcode"),
    sponsorPhone: Phone,
    sponsorWebsite: Website,
    sponsorDesignation: RequiredString,
    publicPhone: Phone,
    publicEmail: Email,
    scientificPhone: Phone,
    scientificEmail: Email
  })
]);

export const ContractResearchSchema = z.discriminatedUnion("isThereAnyCRO", [
  z.object({
    studyId: RequiredString,
    isThereAnyCRO: z.literal(false),
    name: z.any(),
    country: z.any(),
    region: z.any(),
    city: z.any(),
    postcode: z.any(),
    tel: z.any(),
    croWebsite: z.any(),
    roleOrServices: z.any(),
    otherRoleOrServices: z.any()
  }),
  z
    .object({
      studyId: RequiredString,
      isThereAnyCRO: z.literal(true),
      name: RequiredString,
      country: PositiveInteger("country"),
      region: PositiveInteger("region"),
      city: PositiveInteger("city"),
      postcode: PositiveInteger("postcode"),
      tel: Phone,
      croWebsite: Website,
      roleOrServices: PositiveInteger("roleOrServices"),
      otherRoleOrServices: z.any()
    })
    .superRefine((data, ctx) => {
      if (data.roleOrServices === 6 && !data.otherRoleOrServices?.trim()) {
        ctx.addIssue({
          path: ["otherRoleOrServices"],
          code: "custom",
          message: "Other role or service is required when role is 'Other'"
        });
      }
    })
]);

export const CollaborationsSchema = z.discriminatedUnion("isThereAnyCollaboration", [
  z.object({
    studyId: RequiredString,
    isThereAnyCollaboration: z.literal(false),
    name: z.any(),
    country: z.any(),
    region: z.any(),
    city: z.any(),
    postcode: z.any(),
    tel: z.any(),
    website: z.any(),
    designation: z.any(),
    publicContact: z.any(),
    scientificContact: z.any()
  }),
  z.object({
    studyId: RequiredString,
    isThereAnyCollaboration: z.literal(true),
    name: RequiredString,
    country: PositiveInteger("country"),
    region: PositiveInteger("region"),
    city: PositiveInteger("city"),
    postcode: RequiredNumber,
    tel: Phone,
    website: Website,
    designation: RequiredString,
    publicContact: ContactInfo,
    scientificContact: ContactInfo
  })
]);

export const FoundersSchema = z
  .object({
    studyId: RequiredString,
    sources: z
      .array(z.number().int().positive("Source must be a positive number"))
      .min(1, "At least one source is required"),
    sourceText: z.string().optional(),
    type: z
      .array(z.number().int().positive("Type must be a positive number"))
      .min(1, "At least one type is required"),
    typeText: z.string().optional()
  })
  .superRefine((data, ctx) => {
    // Conditionally require sourceText if sources contains 6
    if (data.sources.includes(6) && !data.sourceText?.trim()) {
      ctx.addIssue({
        path: ["sourceText"],
        code: "custom",
        message: "Source text is required when 'Other' (6) is selected in sources"
      });
    }

    // Conditionally require typeText if type contains 3
    if (data.type.includes(3) && !data.typeText?.trim()) {
      ctx.addIssue({
        path: ["typeText"],
        code: "custom",
        message: "Type text is required when 'Other' (3) is selected in type"
      });
    }
  });
