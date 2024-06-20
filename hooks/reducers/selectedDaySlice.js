// reducers/selectedDateSlice.js
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const today = dayjs().format("YYYY-MM-DD");

const selectedDateSlice = createSlice({
  name: "selectedDate",
  initialState: today,
  reducers: {
    setSelectedDate: (state, action) => action.payload,
  },
});

export const { setSelectedDate } = selectedDateSlice.actions;
export default selectedDateSlice.reducer;
