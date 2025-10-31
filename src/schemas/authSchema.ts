import { baseSchema, passwordPreRegisterSchema, passwordResetSchema } from "./index";





export const loginSchema = baseSchema.pick({
  email: true,
  password: true
});

export const verifySchema = baseSchema.pick({
  email: true,
  code: true
});


export const registerSchema = baseSchema.pick({
  email: true,
  newPassword: true,
  confirmPassword: true,
  firstName: true,
  secondName: true,
  lastName: true,
  idNumber: true,
  dateOfBirth: true
});

export const forgotPasswordSchema = baseSchema.pick({
  email: true
});

export const OrgInfoSchema = baseSchema.pick({
  organizationType: true,
  organizationId: true,
  region: true,
  city: true,
  nameAr: true,
  nameEn: true,
  website: true,
  organizationCode: true
});

export const resetPasswordSchema = baseSchema
  .pick({ token: true, email: true })
  .and(passwordResetSchema);

export const preRegisterSchema = baseSchema
  .pick({
    email: true,
    userType: true
  })
  .and(passwordPreRegisterSchema);

export const identityValidationSchema = baseSchema.pick({
  idNumber: true,
  dateofbirth: true
});