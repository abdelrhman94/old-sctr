import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const reviewStudySlice = createSlice({
  name: "reviewStudy",
  initialState: { current: 1 },
  reducers: {
    setReviewStudyStep: (s, a: PayloadAction<number>) => {
      s.current = Math.max(1, Math.floor(a.payload));
    },
    nextReviewStudyStep: (s) => {
      s.current = Math.max(1, s.current + 1);
    },
    prevReviewStudyStep: (s) => {
      s.current = Math.max(1, s.current - 1);
    }
  }
});

export const { setReviewStudyStep, nextReviewStudyStep, prevReviewStudyStep } = reviewStudySlice.actions;
export default reviewStudySlice.reducer;
// selector
export const selectReviewStudyStep = (state: any) => state.reviewStudy.current;