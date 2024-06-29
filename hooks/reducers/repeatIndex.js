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
    resetindex: (state) => {
      return {
        ...state,
        repeatIndex: initialRepeatIndex,
      };
    },
  },
});

export const { setrepeatIndex, resetindex } = repeatIndexSlice.actions;
export default repeatIndexSlice.reducer;
