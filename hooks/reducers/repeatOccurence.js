import { createSlice } from "@reduxjs/toolkit";

const repeatOccurenceSlice = createSlice({
  name: "repeatOccurence",
  initialState: {
    repeatOccurence: ["2", " times ", "daily"],
  },
  reducers: {
    setRepeatOccurence: (state, action) => {
      state.repeatOccurence = action.payload;
    },
  },
});

export const { setRepeatOccurence } = repeatOccurenceSlice.actions;
export default repeatOccurenceSlice.reducer;
