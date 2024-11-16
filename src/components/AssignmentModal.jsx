import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowAddAssignmentModal, deleteAssignment, addAssignmentToAPI } from "../redux/slices";  

export default function AssignmentModal({ groups }) {
  const dispatch = useDispatch();
  
  // Accessing necessary Redux state
  const showAddAssignmentModal = useSelector(
    (state) => state.calendar.showAddAssignmentModal
  );
  const hours = useSelector((state) => state.calendar.hours);
  const selectedDay = useSelector((state) => state.calendar.selectedDay);  // Format of selectedDay: "2024-11-11"
  const selectedStartTime = useSelector(
    (state) => state.calendar.selectedStartTime
  );
  const selectedEndTime = useSelector(
    (state) => state.calendar.selectedEndTime
  );
  const assignments = useSelector((state) => state.calendar.assignments);
  const error = useSelector((state) => state.calendar.error); // Redux error handling for the API request

  const timeSlots = hours.flatMap((hour) => hour.subHours);

  const existingAssignment = assignments.find(
    (assignment) =>
      assignment.day === selectedDay &&
      assignment.startTime === selectedStartTime &&
      assignment.endTime === selectedEndTime
  );

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    teacher: "",
    group: "",
    nbrAssignment: "",
    startTime: "",
    endTime: "",
    saleName: "",
    day: "", // Storing the day name
    id: null,
  });

  useEffect(() => {
    if (showAddAssignmentModal && selectedStartTime && selectedEndTime) {
      if (existingAssignment) {
        setAssignmentData(existingAssignment);
      } else {
        setAssignmentData((prevData) => ({
          ...prevData,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          day: formatDateToDayName(selectedDay),  // Convert selected day to day name
          id: null,
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

    // Ensure `day` is set before submitting
    const assignment = {
      title: assignmentData.title,
      day: assignmentData.day, // Storing day name
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    };

    if (!assignment.day) {
      console.error("Day is required.");
      return;
    }

    if (assignment.title && assignment.day) {
      dispatch(addAssignmentToAPI(assignment));
      console.log("Submitting assignment:", assignment);
    } else {
      console.error("Invalid data:", assignment);
    }
  };

  const handleDelete = () => {
    if (assignmentData.id) {
      dispatch(deleteAssignment(assignmentData.id));
      handleClose();
    }
  };

  const resetForm = () => {
    setAssignmentData({
      title: "",
      teacher: "",
      group: "",
      nbrAssignment: "",
      startTime: "",
      endTime: "",
      saleName: "",
      day: "", // Reset day name
      id: null,
    });
  };

  // Function to convert date string to day name
  const formatDateToDayName = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" }; // Options for day name (e.g., "Monday")
    return date.toLocaleDateString("en-US", options);
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

        <input
          type="text"
          name="title"
          placeholder="Assignment title"
          value={assignmentData.title}
          onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
          className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
          required
        />

        <div className="mb-2">
          <input
            type="text"
            name="saleName"
            placeholder="Sale Name"
            value={assignmentData.saleName}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, saleName: e.target.value })
            }
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
          />
        </div>

        {/* Day selection */}
        <div className="mb-2">
          <label htmlFor="day" className="block mb-1">
            Select Day:
          </label>
          <input
            type="text"
            id="day"
            value={assignmentData.day} // Display day name
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, day: e.target.value })
            }
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
            required disabled
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

        <label className="block mb-2">
          Group:
          <select
            value={assignmentData.group}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, group: e.target.value })
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

        {error && <p className="text-red-500">{error}</p>} {/* Show error messages */}

        <div className="flex justify-between items-center mt-2">
          <button
            type="submit"
            className="bg-sky-600 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:bg-sky-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {assignmentData.id ? "Update" : "Add"}
          </button>

          {assignmentData.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:bg-red-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
