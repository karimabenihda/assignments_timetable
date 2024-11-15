import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  startOfWeek: dayjs().startOf("week").add(1, "day").format('YYYY-MM-DD'),
  assignments: [],
  hours: Array.from({ length: 10 }, (_, i) => ({
    startTime: `${8 + i}:30`,
    endTime: `${9 + i}:30`,
  })),
  showAddAssignmentModal: false,
  selectedDay: null,
  selectedStartTime: "", 
  selectedEndTime: ""
};

const slice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDay(state, action) {
      state.selectedDay = action.payload;
    },
    setSelectedStartTime(state, action) {
      state.selectedStartTime = action.payload;  // Set the startTime for the modal
    },
    setSelectedEndTime(state, action) {
      state.selectedEndTime = action.payload;  // Set the startTime for the modal
    },
    setShowAddAssignmentModal(state, action) {
      state.showAddAssignmentModal = action.payload;
    },
    addAssignment(state, action) {
      state.assignments.push(action.payload);
    },
    updateAssignment(state, action) {
      const index = state.assignments.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    deleteAssignment(state, action) {
      state.assignments = state.assignments.filter((event) => event.id !== action.payload.id);
    },
  },
});

export const { 
  setSelectedDay,
  setSelectedStartTime,
  setSelectedEndTime,
  setShowAddAssignmentModal,
  addAssignment,
  updateAssignment,
  deleteAssignment 
} = slice.actions;

export default slice.reducer;
