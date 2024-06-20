// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import selectedDateReducer from "../reducers/selectedDaySlice";
import rootReducer from "../reducers";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
