// registrationStepsSlice.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";





type RegistrationStepState = { current: number; tempAccountId?: string; tempOrgId?: string; email?: string };
const initialState: RegistrationStepState = { current: 0 };

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    resetStep: () => initialState,
    setStep: (s, a: PayloadAction<number>) => {
      s.current = Math.max(0, Math.floor(a.payload));
    },
    nextStep: (s) => {
      s.current += 1;
    },
    prevStep: (s) => {
      s.current = Math.max(0, s.current - 1);
    },
    setTempAccountId: (s, a: PayloadAction<string | undefined>) => {
      s.tempAccountId = a.payload;
    },
    setTempOrgId: (s, a: PayloadAction<string | undefined>) => {
      s.tempAccountId = a.payload;
    },
    setUserEmail: (s, a: PayloadAction<string>) => {
      s.email = a.payload;
    },
  }
});

export const { resetStep, setStep, nextStep, prevStep, setTempAccountId, setTempOrgId, setUserEmail } =
  registrationSlice.actions;
export default registrationSlice.reducer;
export const selectCurrentStep = (state: { registration: RegistrationStepState }) =>
  state.registration.current;

export const selectTempAccountId = (state: { registration: RegistrationStepState }) =>
  state.registration.tempAccountId;

export const selectTempOrgId = (state: { registration: RegistrationStepState }) =>
  state.registration.tempOrgId;

export const selectEmail = (state: { registration: RegistrationStepState }) =>
  state.registration.email;