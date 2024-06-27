// redux/slices/dateSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { format, addDays, subDays } from "date-fns";

const initialState = {
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
  },
});

export const { setStartDate, setEndDate } = dateSlice.actions;
export default dateSlice.reducer;
