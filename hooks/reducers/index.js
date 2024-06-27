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
import remindingTimeSlice from "../../hooks/reducers/remindingTime";
import startDate from "../../hooks/reducers/dateSlice";

const rootReducer = combineReducers({
  selectedDate: selectedDateReducer,
  categories: categorySlice,
  task: taskSlice,
  repeatDays: repeatDaysSlice,
  monthlyDays: repeatmonthlyDaysSlice,
  intervalDays: repeatIntervalDaysSlice,
  repeatIndex: repeatIndexSlice,

  // Add other reducers here
});

export default rootReducer;
