import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const createStudySlice = createSlice({
  name: "createStudy",
  initialState: { current: 1 },
  reducers: {
    setCreateStudyStep: (s, a: PayloadAction<number>) => {
      s.current = Math.max(1, Math.floor(a.payload));
    },
    nextCreateStudyStep: (s) => {
      s.current = Math.max(1, s.current + 1);
    },
    prevCreateStudyStep: (s) => {
      s.current = Math.max(1, s.current - 1);
    }
  }
});

export const { setCreateStudyStep, nextCreateStudyStep, prevCreateStudyStep } =
  createStudySlice.actions;
export default createStudySlice.reducer;
// selector
export const selectCreateStudyStep = (state: any) => state.createStudy.current;
