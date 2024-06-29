// redux/slices/dateSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { format, addDays, subDays } from "date-fns";

const initialState = {
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
  weekDay: 7,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
  },
});

export const { setWeekDay } = dateSlice.actions;
export default dateSlice.reducer;
