// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
// Import your slice reducers here
import selectedDateReducer from "./selectedDaySlice";
import categorySlice from "./categorySlice";
import taskSlice from "./taskSlice";

const rootReducer = combineReducers({
  selectedDate: selectedDateReducer,
  categories: categorySlice,
  task: taskSlice, // Assuming taskSlice has reducer exported as 'reducer'
  // Add other reducers here
});

export default rootReducer;
