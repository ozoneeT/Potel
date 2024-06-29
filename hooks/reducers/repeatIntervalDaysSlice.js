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
    resetInterval: (state) => {
      return {
        ...state,
        intervalDays: initialState,
      };
    },
  },
});

export const { setRepeatIntervalDays, resetInterval } =
  intervalDaysSlice.actions;
export default intervalDaysSlice.reducer;
