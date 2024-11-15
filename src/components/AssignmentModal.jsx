import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowAddAssignmentModal, addAssignment } from '../redux/slices';

export default function AssignmentModal() {
  const dispatch = useDispatch();
  const showAddAssignmentModal = useSelector((state) => state.calendar.showAddAssignmentModal);
  const hours = useSelector((state) => state.calendar.hours);
  const selectedDay = useSelector((state) => state.calendar.selectedDay);
  const selectedStartTime = useSelector((state) => state.calendar.selectedStartTime);
  const selectedEndTime = useSelector((state) => state.calendar.selectedEndTime)


  const [assignmentData, setAssignmentData] = useState({
    title: "",
    teacher: "",
    group: "",
    nbrAssignment: "",
    startTime: "",  
    endTime: ""
  });

  // Use useEffect to set startTime when the modal opens or selectedStartTime changes
  useEffect(() => {
    if (showAddAssignmentModal && selectedStartTime && selectedEndTime) {
      setAssignmentData(prevData => ({
        ...prevData,
        startTime: selectedStartTime,
        endTime: selectedEndTime
      }));
    }
  }, [showAddAssignmentModal, selectedStartTime, selectedEndTime]); // Runs when modal opens or selectedStartTime changes

  const handleClose = () => {
    dispatch(setShowAddAssignmentModal(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assignmentData.title || !assignmentData.startTime || !assignmentData.endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const calendarEvent = {
      ...assignmentData,
      day: selectedDay,
      id: Date.now(),
    };

    dispatch(addAssignment(calendarEvent));
    dispatch(setShowAddAssignmentModal(false));

    // Reset the modal data after saving
    setAssignmentData({
      title: "",
      teacher: "",
      group: "",
      nbrAssignment: "",
      startTime: "",
      endTime: "",
    });
  };

  if (!showAddAssignmentModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form className="bg-white rounded-lg shadow-2xl w-1/3 p-4" onSubmit={handleSubmit}>
        <header className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Add Assignment</h2>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </header>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Assignment title"
            value={assignmentData.title}
            onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-lg"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="teacher"
            placeholder="Teacher"
            value={assignmentData.teacher}
            onChange={(e) => setAssignmentData({ ...assignmentData, teacher: e.target.value })}
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
          />
        </div>
        <label>
          Start Time:
          <select
            value={assignmentData.startTime}
            onChange={(e) => setAssignmentData({ ...assignmentData, startTime: e.target.value })}
            required
          >
            <option value="">Select Start Time</option>
            {hours.map((hour) => (
              <option key={hour.startTime} value={hour.startTime}>
                {hour.startTime}
              </option>
            ))}
          </select>
        </label>

        <label>
          End Time:
          <select
            value={assignmentData.endTime}
            onChange={(e) => setAssignmentData({ ...assignmentData, endTime: e.target.value })}
            required
          >
            <option value="">Select End Time</option>
            {hours.map((hour) => (
              <option key={hour.endTime} value={hour.endTime}>
                {hour.endTime}
              </option>
            ))}
          </select>
        </label>
        <footer className="flex justify-end gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
