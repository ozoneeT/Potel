import { createSlice } from "@reduxjs/toolkit";

const initialRepeatIndex = 0;
const initialRepeatDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const repeatDaysSlice = createSlice({
  name: "repeatDays",
  initialState: {
    repeatDays: initialRepeatDays, // Daily repeat days (e.g., ['Sunday', 'Monday'])
    monthlyDays: [], // Monthly repeat days (e.g., [1, 2, 3])
    intervalDays: 0, // Interval days (e.g., 2 for every 2 days)
    repeatIndex: initialRepeatIndex, // Selected repeat option index (0 for Daily, 1 for Monthly, 2 for Interval)
  },
  reducers: {
    setRepeatDays: (state, action) => {
      state.repeatDays = action.payload;
    },
    setRepeatMonthlyDays: (state, action) => {
      state.monthlyDays = action.payload;
    },
    setRepeatIntervalDays: (state, action) => {
      state.intervalDays = action.payload;
    },
    setRepeatIndex: (state, action) => {
      state.repeatIndex = action.payload;
    },
    resetIndex: (state) => {
      state.repeatIndex = initialRepeatIndex;
    },
    resetDays: (state) => {
      state.repeatDays = initialRepeatDays;
    },
  },
});

export const {
  setRepeatDays,
  setRepeatMonthlyDays,
  setRepeatIntervalDays,
  setRepeatIndex,
  resetIndex,
  resetDays,
} = repeatDaysSlice.actions;

export default repeatDaysSlice.reducer;
