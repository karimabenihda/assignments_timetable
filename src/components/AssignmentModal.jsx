// assignment.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowAddAssignmentModal,
  addAssignmentToAPI,
  deleteAssignment,
  updateAssignment,
} from "../redux/slices";

export default function AssignmentModal({ groups }) {
  const dispatch = useDispatch();
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
    teacher: "",
    group: "",
    nbrAssignment: "",
    startTime: "",
    endTime: "",
    saleName: "",
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
          id: null,
        }));
      }
    }
  }, [showAddAssignmentModal, selectedStartTime, selectedEndTime, existingAssignment]);

  const handleClose = () => {
    dispatch(setShowAddAssignmentModal(false));
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assignmentData.title || !assignmentData.startTime || !assignmentData.endTime || !assignmentData.group) {
      alert("Please fill in all required fields.");
      return;
    }

    if (assignmentData.id) {
      dispatch(updateAssignment({ ...assignmentData, day: selectedDay }));
    } else {
      dispatch(
        addAssignmentToAPI({ ...assignmentData, day: selectedDay, id: Date.now() })
      );
    }
    handleClose();
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
            name="saleName"
            placeholder="Sale Name"
            value={assignmentData.saleName}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, saleName: e.target.value })
            }
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
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
           className="bg-red-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:bg-red-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
         >
           Delete
         </button>
         
          )}
        </div>
      </form>
    </div>
  );
}
