import { createSlice } from "@reduxjs/toolkit";
initialRepeatIndex = 0;

const repeatIndexSlice = createSlice({
  name: "repeatIndex",
  initialState: {
    repeatIndex: initialRepeatIndex,
  },
  reducers: {
    setrepeatIndex: (state, action) => {
      state.repeatIndex = action.payload;
    },
  },
});

export const { setrepeatIndex } = repeatIndexSlice.actions;
export default repeatIndexSlice.reducer;
