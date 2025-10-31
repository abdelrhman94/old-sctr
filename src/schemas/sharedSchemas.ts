// sharedSchemas.ts
import { z } from "zod";

import {
  ACCEPTED_FILE_TYPES,
  ARABIC_TEXT,
  ENGLISH_TEXT,
  MAX_FILE_SIZE,
  MIN_DATE,
  PHONE,
  TODAY
} from "@/constants/constants";

export const RequiredString = z.string().min(1, "Required");
export const RequiredNumber = z.number().min(1, "Required");

export const ArabicText = RequiredString.regex(ARABIC_TEXT, "Arabic letters/numbers only");
export const EnglishText = RequiredString.regex(ENGLISH_TEXT, "English letters/numbers only");

export const Phone = z
  .string()
  .min(1, "Required")
  .regex(PHONE, "Must start with 966 and contain 9 digits");

export const Email = z.string().email("Invalid email");

export const FileAttachment = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 5 MB")
  .refine(
    (f) => ACCEPTED_FILE_TYPES.includes(f.type) || f.name.toLowerCase().endsWith(".pdf"),
    "Only PDF files are allowed"
  );

export const Website = z.string().nonempty("Website is required").url("Invalid URL");

export const PositiveInteger = (field = "This field") =>
  z.number().int().positive(`${field} is required`);

export const ValidDate = z.date().min(MIN_DATE).max(TODAY);

export const ContactInfo = z.object({
  fullName: RequiredString,
  phoneNumber: Phone,
  email: Email
});
