import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initialState = {
  taskIcon: "calendar-clock",
  repeat: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  taskRepeat: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  repeatType: "daily",
  taskColor: "#d2e6fe",
  taskName: "",
  repeatOccurence: ["2", " times ", "daily"],
  selectedDays: [1],
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
  masterCategory: { id: "1", iconName: "✨", categoryName: "All" },
  remindingTime: "09:00 AM",
  reminderEnabled: false,
  tasks: [], // Store tasks
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
    setTaskRepeat: (state, action) => {
      state.taskRepeat = action.payload;
    },
    setrepeatType: (state, action) => {
      state.repeatType = action.payload;
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
        id: action.payload.id,
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
      return {
        ...state,
        taskIcon: initialState.taskIcon,
        repeat: [...initialState.repeat], // Ensure repeat is reset correctly
        taskColor: initialState.taskColor,
        taskName: initialState.taskName,
        repeatOccurence: [...initialState.repeatOccurence],
        selectedDays: [...initialState.selectedDays],
        startDate: initialState.startDate,
        endDate: initialState.endDate,
        masterCategory: { ...initialState.masterCategory },
        remindingTime: initialState.remindingTime,
        reminderEnabled: initialState.reminderEnabled,
      };
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
  setTaskRepeat,
  addTask,
  resetTaskDetails,
  setrepeatType,
} = taskSlice.actions;

export default taskSlice.reducer;
