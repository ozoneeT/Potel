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
  endDateEnabled: false,
  masterCategory: { id: "1", iconName: "✨", categoryName: "All" },
  remindingTime: "09:00 AM",
  taskTime: "",
  endTime: "",
  reminderEnabled: false,
  remindingTimeEnabled: false,
  timeSegment: 0,
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
    setStarttime: (state, action) => {
      state.taskTime = action.payload;
    },
    setEndtime: (state, action) => {
      state.endTime = action.payload;
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
    setendDateEnabled: (state, action) => {
      state.endDateEnabled = action.payload;
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
    setRemindingTimeEnabled: (state, action) => {
      state.remindingTimeEnabled = action.payload;
    },
    setTimeSegment: (state, action) => {
      state.timeSegment = action.payload;
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
        endDateEnabled: initialState.endDateEnabled,
        masterCategory: { ...initialState.masterCategory },
        remindingTime: initialState.remindingTime,
        reminderEnabled: initialState.reminderEnabled,
        startTime: initialState.taskTime,
        endTime: initialState.end,
        remindingTimeEnabled: initialState.remindingTimeEnabled,
        timeSegment: initialState.timeSegment,
      };
    },
  },
});

export const {
  setTaskIcon,
  setTaskColor,
  setTaskName,
  setEndtime,
  setStarttime,
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
  setendDateEnabled,
  setRemindingTimeEnabled,
  setTimeSegment,
} = taskSlice.actions;

export default taskSlice.reducer;
