import { createSlice } from "@reduxjs/toolkit";
initialRepeatDays = [
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
    repeatDays: initialRepeatDays,
    initialDays: initialRepeatDays,
  },
  reducers: {
    setRepeatDays: (state, action) => {
      state.repeatDays = action.payload;
    },
  },
});

export const { setRepeatDays } = repeatDaysSlice.actions;
export default repeatDaysSlice.reducer;
