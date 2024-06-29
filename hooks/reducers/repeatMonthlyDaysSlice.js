import { createSlice } from "@reduxjs/toolkit";

const initialSelectedDays = [1];
const repeatmonthlyDaysSlice = createSlice({
  name: "monthlyDays",
  initialState: {
    selectedDays: initialSelectedDays,
  },
  reducers: {
    setRepeatmonthlyDays: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.selectedDays = payload;
      } else {
        const day = payload;
        if (state.selectedDays.includes(day)) {
          if (state.selectedDays.length > 1) {
            state.selectedDays = state.selectedDays.filter((d) => d !== day);
          }
        } else {
          state.selectedDays.push(day);
        }
      }
      // Sort the array after modification
      state.selectedDays.sort((a, b) => a - b);
    },
    resetMonthlydays: (state) => {
      state.selectedDays = initialSelectedDays;
    },
  },
});

export const { setRepeatmonthlyDays, resetMonthlydays } =
  repeatmonthlyDaysSlice.actions;
export default repeatmonthlyDaysSlice.reducer;
