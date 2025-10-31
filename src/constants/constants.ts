// constants.ts
export const ARABIC_TEXT = /^[\u0600-\u06FF0-9\s.,()\-]+$/u;
export const ENGLISH_TEXT = /^[A-Za-z0-9\s.,()\-]+$/;
export const NUMERIC_ONLY = /^\d+$/;
export const KEYWORDS = /^[A-Za-z0-9\s,]+$/;
export const PHONE = /^966\d{9}$/;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["application/pdf"];
export const MIN_DATE = new Date(1900, 0, 1);
export const TODAY = new Date();
