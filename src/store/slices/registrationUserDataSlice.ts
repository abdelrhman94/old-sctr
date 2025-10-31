import { PayloadAction, createSlice } from "@reduxjs/toolkit";





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

type RegistrationUserDataState = {
  identityValidation?: IdentityValidationResponse; 
};

const initialState: RegistrationUserDataState = {};

const registrationUserDataSlice = createSlice({
  name: "registrationData",
  initialState,
  reducers: {
    setIdentityValidationData: (s, a: PayloadAction<IdentityValidationResponse | undefined>) => {
      s.identityValidation = a.payload;
    },
    clearRegistrationData: () => initialState
  }
});

export const { setIdentityValidationData, clearRegistrationData } = registrationUserDataSlice.actions;
export default registrationUserDataSlice.reducer;

// selectors
export const selectIdentityValidationData = (state: { registrationData: RegistrationUserDataState }) =>
  state.registrationData.identityValidation;