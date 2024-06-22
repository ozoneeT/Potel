import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDay: null,
};

const intervalDaysSlice = createSlice({
  name: "intervalDays",
  initialState,
  reducers: {
    setRepeatIntervalDays: (state, action) => {
      state.selectedDay = action.payload;
    },
  },
});

export const { setRepeatIntervalDays } = intervalDaysSlice.actions;
export default intervalDaysSlice.reducer;
