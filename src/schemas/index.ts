import { differenceInYears } from "date-fns";
import { z } from "zod";

const today = new Date();
const MIN_DATE = new Date(1900, 0, 1);
const MIN_AGE = 18;

export const nameLangSchema = z.object({
  en: z.string().nonempty("Required").min(1, "Required"),
  ar: z.string().nonempty("Required").min(1, "Required")
});

export const fieldSchemas = {
  email: z.string().nonempty("Required").email({ message: "Invalid email address" }),
  firstName: nameLangSchema,
  secondName: nameLangSchema,
  lastName: nameLangSchema,
  idNumber: z
    .string()
    .nonempty("Required")
    .regex(/^[12]\d{9}$/, "ID number must start with 1 or 2 and contain exactly 10 digits"),
  dateofbirth: z
    .date()
    .min(MIN_DATE, { message: "Date is too early" })
    .max(today, { message: "Date of birth must be in the past" })
    .refine((d) => differenceInYears(today, d) >= MIN_AGE, {
      message: `You must be at least ${MIN_AGE} years old`
    }),
  password: z.string().nonempty("Required").min(8, "Password must be at least 8 characters"),
  newPassword: z
    .string()
    .nonempty("Required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z
    .string()
    .nonempty("Required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  token: z.string().min(1, "Missing or invalid token"),
  id: z.string().min(1, "Missing or invalid id"),
  address1: z.string().min(1, "Required"),
  address2: z.string().min(1, "Required"),
  postalCode: z
    .string()
    .nonempty("Postal code is required")
    .regex(/^\d{5}$/, "Postal code must contain exactly 5 digits"),
  mobileNumber: z
    .string()
    .min(1, "Required")
    .max(11, "Required")
    .regex(/^05\d+$/, "Mobile number must start with 05 and contain only digits"),
  organizationId: z.string().min(1, "Missing or invalid id"),
  userType: z.number().min(1, "Missing or invalid user type"),
  jobTitle: z.string().min(1, "Required"),
  jobTitleText: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  requestType: z.number().min(1, "Missing or invalid user type"),
  organizationType: z.string().min(1, "Missing or invalid organization type"),
  region: z.number().min(1, "Missing or invalid region"),
  city: z.number().min(1, "Missing or invalid city"),

  nameAr: z.string().nonempty("Required").min(1, "Required"),
  nameEn: z.string().nonempty("Required").min(1, "Required"),
  firstNameAr: z.string().nonempty("Required").min(1, "Required"),
  firstNameEn: z.string().nonempty("Required").min(1, "Required"),
  secondNameAr: z.string().nonempty("Required").min(1, "Required"),
  secondNameEn: z.string().nonempty("Required").min(1, "Required"),
  familyNameAr: z.string().nonempty("Required").min(1, "Required"),
  familyNameEn: z.string().nonempty("Required").min(1, "Required"),
  organizationCode: z.string().nonempty("Required").min(1, "Required"),
  website: z.string().nonempty("Website is required").url("Invalid URL"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  termApproved: z.boolean().refine((v) => v, {
    message: "You must accept the terms & conditions."
  })
};

export const baseSchema = z.object(fieldSchemas);

export const passwordResetSchema = z
  .object({
    newPassword: fieldSchemas.newPassword,
    confirmPassword: fieldSchemas.confirmPassword
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export const passwordPreRegisterSchema = z
  .object({
    password: fieldSchemas.password,
    confirmPassword: fieldSchemas.confirmPassword
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export const userRegisterSchema = z
  .object({
    idNumber: z.any().optional(),
    dateOfBirth: z.any().optional(),
    email: z.string().nonempty("Required").email({ message: "Invalid email address" }),
    organizationId: z.any().nullable().optional(),
    password: fieldSchemas.password,
    confirmPassword: fieldSchemas.confirmPassword,
    userType: z.number().min(1, "Missing or invalid user type"),
    firstNameAr: z.string().min(1, "First name (Arabic) is required"),
    secondNameAr: z.string().min(1, "Second name (Arabic) is required"),
    familyNameAr: z.string().min(1, "Family name (Arabic) is required"),
    firstNameEn: z.string().min(1, "First name (English) is required"),
    secondNameEn: z.string().min(1, "Second name (English) is required"),
    familyNameEn: z.string().min(1, "Family name (English) is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.any().optional(),
    postalCode: z
      .string()
      .nonempty("Postal code is required")
      .regex(/^\d{5}$/, "Postal code must contain exactly 5 digits"),
    region: z.number().min(1, "Region is required"),
    city: z.number().min(1, "City is required"),
    mobileNumber: z
      .string()
      .regex(/^05\d{8}$/, "Mobile number must start with 05 and be 10 digits"),
    jobTitle: z.any().optional(),
    jobTitleText: z.string().min(1, "Job title is required"),
    department: z.string().min(1, "Department is required"),
    currentSite: z.string().min(1, "Current Site is required"),
    termApproved: z.boolean().refine((v) => v, {
      message: "You must accept the terms & conditions."
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });
