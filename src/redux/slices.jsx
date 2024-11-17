import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";

const API_URL = "http://localhost:8000/seance";

// Fetch assignments from the API
export const fetchAssignments = createAsyncThunk(
  "calendar/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      console.log("Fetched assignments:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching assignments"
      );
    }
  }
);

// Add a new assignment to the API
export const addAssignmentToAPI = createAsyncThunk(
  "calendar/addAssignmentToAPI",
  async (assignment, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, assignment);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error adding assignment"
      );
    }
  }
);

const initialState = {
  startOfWeek: dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"),
  assignments: [],
  hours: Array.from({ length: 10 }, (_, i) => {
    const startTime = dayjs().hour(8 + i).minute(30);
    return {
      startTime: startTime.format("HH:mm"),
      endTime: startTime.add(1, "hour").format("HH:mm"),
      subHours: [
        {
          startTime: startTime.format("HH:mm"),
          endTime: startTime.add(30, "minute").format("HH:mm"),
        },
        {
          startTime: startTime.add(30, "minute").format("HH:mm"),
          endTime: startTime.add(1, "hour").format("HH:mm"),
        },
      ],
    };
  }),
  showAddAssignmentModal: false,
  selectedDay: null,
  selectedStartTime: "",
  selectedEndTime: "",
  loading: false,
  error: null,
};

// Calendar slice
const slice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDay(state, action) {
      state.selectedDay = action.payload;
    },
    setSelectedStartTime(state, action) {
      state.selectedStartTime = action.payload;
    },
    setSelectedEndTime(state, action) {
      state.selectedEndTime = action.payload;
    },
    setShowAddAssignmentModal(state, action) {
      state.showAddAssignmentModal = action.payload;
    },
    // Static delete for assignment
    deleteAssignment(state, action) {
      state.assignments = state.assignments.filter(
        (assignment) => assignment.id !== action.payload
      );
    },
    // Static update for assignment
    updateAssignment(state, action) {
      const index = state.assignments.findIndex(
        (assignment) => assignment.id === action.payload.id
      );
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAssignments.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAssignments.fulfilled, (state, action) => {
      if (action.payload) {
        state.assignments = action.payload;
        state.loading = false;
      } else {
        state.error = "No data returned from API";
      }
    })
    .addCase(fetchAssignments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error fetching assignments";
    })
    
      .addCase(addAssignmentToAPI.fulfilled, (state, action) => {
        // Check if action.payload exists before pushing to the assignments array
        if (action.payload) {
          state.assignments.push(action.payload);
        } else {
          console.error("No payload in action:", action);
        }
      })
      
      .addCase(addAssignmentToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error adding assignment";
      });
  },
});

export const {
  setSelectedDay,
  setSelectedStartTime,
  setSelectedEndTime,
  setShowAddAssignmentModal,
  deleteAssignment,
  updateAssignment,
} = slice.actions;

export default slice.reducer;
