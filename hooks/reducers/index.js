// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
// Import your slice reducers here
import selectedDateReducer from "./selectedDaySlice";
import categorySlice from "./categorySlice";
import taskSlice from "./taskSlice";
import repeatDaysSlice from "./repeatDaysSlice";
import date from "../../hooks/reducers/dateSlice";

const rootReducer = combineReducers({
  selectedDate: selectedDateReducer,
  categories: categorySlice,
  task: taskSlice,
  repeatDays: repeatDaysSlice,
  date: date,

  // Add other reducers here
});

export default rootReducer;
