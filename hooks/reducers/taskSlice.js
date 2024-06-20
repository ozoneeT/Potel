// reducers/taskSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskIcon: "calendar-clock",
  taskColor: "#d2e6fe",
  taskName: "",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskIcon: (state, action) => {
      state.taskIcon = action.payload;
    },
    setTaskColor: (state, action) => {
      state.taskColor = action.payload;
    },
    setTaskName: (state, action) => {
      state.taskName = action.payload;
    },
  },
});

export const { setTaskIcon, setTaskColor, setTaskName } = taskSlice.actions;

export default taskSlice.reducer;
