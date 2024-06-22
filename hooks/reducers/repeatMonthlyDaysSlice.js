import { createSlice } from "@reduxjs/toolkit";

const repeatmonthlyDaysSlice = createSlice({
  name: "monthlyDays",
  initialState: {
    selectedDays: [1],
  },
  reducers: {
    setRepeatmonthlyDays: (state, action) => {
      const day = action.payload;
      if (state.selectedDays.includes(day)) {
        if (state.selectedDays.length > 1) {
          state.selectedDays = state.selectedDays.filter((d) => d !== day);
        }
      } else {
        state.selectedDays.push(day);
      }
      // Sort the array after modification
      state.selectedDays.sort((a, b) => a - b);
    },
  },
});

export const { setRepeatmonthlyDays } = repeatmonthlyDaysSlice.actions;
export default repeatmonthlyDaysSlice.reducer;
