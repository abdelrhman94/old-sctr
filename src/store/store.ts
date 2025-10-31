import { configureStore } from "@reduxjs/toolkit";



import { apiSlice } from "./slices/apiSlice";
import authSlice from "./slices/authSlice";
import createStudyReducer from "./slices/createStudyStepsSlice";
import reviewStudyReducer from "./slices/reviewStudyStepsSlice";
import registrationReducer from "./slices/registrationStepsSlice";
import registrationUserDataSlice from "./slices/registrationUserDataSlice";





export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authSlice,
      registration: registrationReducer,
      registrationData: registrationUserDataSlice,
      createStudy: createStudyReducer,
      reviewStudy: reviewStudyReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([apiSlice.middleware])
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];