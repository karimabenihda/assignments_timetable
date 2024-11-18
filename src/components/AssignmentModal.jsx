import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowAddAssignmentModal,
  addAssignmentToAPI,
  deleteAssignment,
  updateAssignment,
  deleteSeanceFromAPI,
updateSeanceInAPI
} from "../redux/slices";
import { useLocation } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentModal({ groups }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullname = queryParams.get("formateur");

  const showAddAssignmentModal = useSelector(
    (state) => state.calendar.showAddAssignmentModal
  );
  const hours = useSelector((state) => state.calendar.hours);
  const selectedDay = useSelector((state) => state.calendar.selectedDay);
  const selectedStartTime = useSelector(
    (state) => state.calendar.selectedStartTime
  );
  const selectedEndTime = useSelector(
    (state) => state.calendar.selectedEndTime
  );
  const assignments = useSelector((state) => state.calendar.assignments);

  const timeSlots = hours.flatMap((hour) => hour.subHours);

  const existingAssignment = assignments.find(
    (assignment) =>
      assignment.day === selectedDay &&
      assignment.startTime === selectedStartTime &&
      assignment.endTime === selectedEndTime
  );

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    formateur: fullname || "",
    intituleGroupe: "",
    startTime: selectedStartTime || "08:30",
    endTime: selectedEndTime || "09:00",
    salle: "",
    day: "", // Will store the weekday string like 'Monday'
    id: null,
  });

  // Convert date string to weekday name (e.g., "2024-11-19" => "Monday")
  const formatDateToDayName = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options).toLowerCase(); // Convert to lowercase for consistency
  };

  useEffect(() => {
    if (showAddAssignmentModal && selectedStartTime && selectedEndTime) {
      if (existingAssignment) {
        setAssignmentData({
          ...existingAssignment,
          day: formatDateToDayName(existingAssignment.day), // Convert day to weekday string
        });
      } else {
        setAssignmentData((prevData) => ({
          ...prevData,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          id: null,
          day: formatDateToDayName(selectedDay), // Convert selectedDay to weekday string
        }));
      }
    }
  }, [showAddAssignmentModal, selectedStartTime, selectedEndTime, existingAssignment, selectedDay]);

  const handleClose = () => {
    dispatch(setShowAddAssignmentModal(false));
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!assignmentData.title || !assignmentData.startTime || !assignmentData.endTime || !assignmentData.intituleGroupe) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare data for submission
    const dataToSubmit = {
      ...assignmentData,
      day: selectedDay || formatDateToDayName(selectedDay), // Use selectedDay if not already set
      id: assignmentData.id || uuidv4(), // Use existing ID if editing, else generate a new one
    };
if (assignmentData.id) {
  dispatch(updateAssignment(dataToSubmit));  // Correctly dispatch the update action for assignments
  dispatch(updateSeanceInAPI(dataToSubmit)); // Make sure this action is actually needed (i.e., it's not redundant)
} else {
  dispatch(addAssignmentToAPI(dataToSubmit)); // If there's no ID, it's a new assignment
}


    console.log("Submitting assignment:", dataToSubmit);

    handleClose();
  };

  const handleDelete = () => {
    if (assignmentData.id) {
      dispatch(deleteAssignment(assignmentData.id));
      dispatch(deleteSeanceFromAPI(assignmentData.id));


      handleClose();
    }
  };

  const resetForm = () => {
    setAssignmentData({
      title: "",
      formateur: fullname || "",
      intituleGroupe: "",
      startTime: selectedStartTime || "08:30",
      endTime: selectedEndTime || "09:00",
      salle: "",
      day: "", // Reset the day field
      id: null,
    });
  };

  if (!showAddAssignmentModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        className="bg-white rounded-lg shadow-2xl w-1/3 p-4"
        onSubmit={handleSubmit}
      >
        <header className="flex justify-between items-center border-b pb-2 mb-2">
          <h2 className="text-xl font-semibold">
            {assignmentData.id ? "Edit Assignment" : "Add Assignment"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </header>

        <div className="mb-2">
          <input
            type="text"
            name="title"
            placeholder="Assignment title"
            value={assignmentData.title}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, title: e.target.value })
            }
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
            required
          />
        </div>

        <div className="mb-2">
          <input
            type="text"
            name="salle"
            placeholder="Salle Name"
            value={assignmentData.salle}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, salle: e.target.value })
            }
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
          />
        </div>

        {/* Disabled input showing the day of the week */}
        <div className="mb-2">
          <input
            type="text"
            name="day"
            value={assignmentData.day}
            readOnly
            className="w-full border-b-2 border-gray-300 bg-gray-100 py-2 text-lg"
          />
        </div>

        <label className="block mb-2">
          Start Time:
          <select
            value={assignmentData.startTime}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, startTime: e.target.value })
            }
            className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg"
          >
            {timeSlots.map((slot) => (
              <option key={slot.startTime} value={slot.startTime}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          End Time:
          <select
            value={assignmentData.endTime}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, endTime: e.target.value })
            }
            className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg"
          >
            {timeSlots.map((slot) => (
              <option key={slot.endTime} value={slot.endTime}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
        </label>

        {/* Group Selection */}
        <label className="block mb-2">
          Group:
          <select
            value={assignmentData.intituleGroupe}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, intituleGroupe: e.target.value })
            }
            className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg"
            required
          >
            <option value="">Select a group</option>
            {groups && groups.map((group) => (
              <option key={group.codeGroupe} value={group.intituleGroupe}>
                {group.intituleGroupe}
              </option>
            ))}
          </select>
        </label>

        <footer className="mt-4 flex justify-between">
          {assignmentData.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="py-2 px-3 bg-red-500 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </button>
          )}

          <div className="space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="py-2 px-3 bg-gray-500 hover:bg-gray-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
            >
              {assignmentData.id ? "Update" : "Add"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
