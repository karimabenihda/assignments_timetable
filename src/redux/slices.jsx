import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";

const API_URL = "http://localhost:8000/assignements";

// Async thunk to fetch assignments
export const fetchAssignments = createAsyncThunk(
  "calendar/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("API Fetch Error: ", error);
      return rejectWithValue(error.response?.data || "Error fetching assignments.");
    }
  }
);


// Async thunk to add a new assignment
export const addAssignmentToAPI = createAsyncThunk(
  "calendar/addAssignmentToAPI",
  async (assignment, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, assignment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding assignment");
    }
  }
);

// Async thunk to fetch seances
export const fetchSeance = createAsyncThunk(
  "calendar/fetchSeance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.assignements; // Assuming "assignements" is the key in the API response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching seance data");
    }
  }
);

// Async thunk to delete a seance
export const deleteSeanceFromAPI = createAsyncThunk(
  "calendar/deleteSeanceFromAPI",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${assignmentId}`);
      return assignmentId;  
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting assignment");
    }
  }
);

// Async thunk to update a seance
export const updateSeanceInAPI = createAsyncThunk(
  "calendar/updateSeance",
  async (updatedSeance, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${updatedSeance.id}`, updatedSeance);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating assignment.");
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
  selectedAssignment: null,
  loading: false,
  error: null,
  seances: [], // Added state for seances
  seanceLoading: false, // Loading state for seances
  seanceError: null, // Error state for seances
};

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
    setSelectedAssignment(state, action) {
      state.selectedAssignment = action.payload;
    },
    setShowAddAssignmentModal(state, action) {
      state.showAddAssignmentModal = action.payload;
    },
    deleteAssignment(state, action) {
      state.assignments = state.assignments.filter(
        (assignment) => assignment.id !== action.payload
      );
    },
    updateAssignment(state, action) {
      const index = state.assignments.findIndex(
        (assignment) => assignment.id === action.payload.id
      );
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    // Reducers for seances
    addSeance(state, action) {
      state.seances.push(action.payload);
    },
    deleteSeance(state, action) {
      state.seances = state.seances.filter((seance) => seance.id !== action.payload);
    },
    updateSeance(state, action) {
      const index = state.seances.findIndex((seance) => seance.id === action.payload.id);
      if (index !== -1) {
        state.seances[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Assignment Thunks
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAssignmentToAPI.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      });

    // Seance Thunks
    builder
      .addCase(fetchSeance.pending, (state) => {
        state.seanceLoading = true;
        state.seanceError = null;
      })
      .addCase(fetchSeance.fulfilled, (state, action) => {
        state.seanceLoading = false;
        state.seances = action.payload;
      })
      .addCase(fetchSeance.rejected, (state, action) => {
        state.seanceLoading = false;
        state.seanceError = action.payload;
      })
      // Handling delete and update for seances
      .addCase(deleteSeanceFromAPI.fulfilled, (state, action) => {
        // Remove the seance from state by ID
        state.seances = state.seances.filter((seance) => seance.id !== action.payload);
      })
      .addCase(updateSeanceInAPI.fulfilled, (state, action) => {
        // Find the seance by ID and update it
        const index = state.seances.findIndex((seance) => seance.id === action.payload.id);
        if (index !== -1) {
          state.seances[index] = action.payload;
        }
      });
  },
});

export const {
  setSelectedDay,
  setSelectedStartTime,
  setSelectedEndTime,
  setSelectedAssignment,
  setShowAddAssignmentModal,
  deleteAssignment,
  updateAssignment,
  addSeance,
  deleteSeance,
  updateSeance,
} = slice.actions;

export default slice.reducer;
