// reducers/taskSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initialState = {
  taskIcon: "calendar-clock",
  repeat: "EveryDay",
  taskColor: "#d2e6fe",
  taskName: "",
  repeatOccurence: ["2", " times ", "daily"],
  selectedDays: [1],
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
  masterCategory: { id: "1", iconName: "✨", categoryName: "All" },
  remindingTime: "09:00 AM",
  reminderEnabled: false,
  tasks: [], // Add this to store tasks
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskIcon: (state, action) => {
      state.taskIcon = action.payload;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload;
    },
    setTaskColor: (state, action) => {
      state.taskColor = action.payload;
    },
    setTaskName: (state, action) => {
      state.taskName = action.payload;
    },
    setRepeatOccurence: (state, action) => {
      state.repeatOccurence = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setmasterCategory: (state, action) => {
      state.masterCategory = {
        categoryName: action.payload.categoryName,
        iconName: action.payload.iconName,
      };
    },
    setRemindingTime: (state, action) => {
      state.remindingTime = action.payload;
    },
    setReminderEnabled: (state, action) => {
      state.reminderEnabled = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    resetTaskDetails: (state) => {
      state.taskIcon = initialState.taskIcon;
      state.repeat = initialState.repeat;
      state.taskColor = initialState.taskColor;
      state.taskName = initialState.taskName;
      state.repeatOccurence = initialState.repeatOccurence;
      state.selectedDays = initialState.selectedDays;
      state.startDate = initialState.startDate;
      state.endDate = initialState.endDate;
      state.masterCategory = initialState.masterCategory;
      state.remindingTime = initialState.remindingTime;
      state.reminderEnabled = initialState.reminderEnabled;
    },
  },
});

export const {
  setTaskIcon,
  setTaskColor,
  setTaskName,
  setmasterCategory,
  setEndDate,
  setRepeatOccurence,
  setStartDate,
  setReminderEnabled,
  setRemindingTime,
  setRepeat,
  addTask,
  resetTaskDetails,
} = taskSlice.actions;

export default taskSlice.reducer;
