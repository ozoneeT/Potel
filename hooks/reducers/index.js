// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
// Import your slice reducers here
import selectedDateReducer from "./selectedDaySlice";
import categorySlice from "./categorySlice";
import taskSlice from "./taskSlice";
import repeatDaysSlice from "./repeatDaysSlice";
import repeatmonthlyDaysSlice from "../../hooks/reducers/repeatMonthlyDaysSlice";
import repeatIntervalDaysSlice from "../../hooks/reducers/repeatIntervalDaysSlice";
import repeatIndexSlice from "../../hooks/reducers/repeatIndex";
import repeatOccurenceSlice from "../../hooks/reducers/repeatOccurence";

const rootReducer = combineReducers({
  selectedDate: selectedDateReducer,
  categories: categorySlice,
  task: taskSlice,
  repeatDays: repeatDaysSlice,
  monthlyDays: repeatmonthlyDaysSlice,
  intervalDays: repeatIntervalDaysSlice,
  repeatIndex: repeatIndexSlice,
  repeatOccurence: repeatOccurenceSlice,
  // Add other reducers here
});

export default rootReducer;
