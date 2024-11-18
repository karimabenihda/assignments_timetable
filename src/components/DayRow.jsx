import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDay,
  setSelectedStartTime,
  setSelectedEndTime,
  setSelectedAssignment,
  setShowAddAssignmentModal,
} from "../redux/slices";

const DayRow = ({ day, hours, assignments }) => {
  const dispatch = useDispatch();
  const assignmentsFromRedux = useSelector((state) => state.assignments);

  // Ensure assignments is an array, even if it's undefined
  const safeAssignments = assignments || [];

  const getSpanCount = (startTime, endTime) => {
    const flatSubHours = hours.flatMap((hour) => hour.subHours);
    const startIndex = flatSubHours.findIndex((subHour) => subHour.startTime === startTime);
    const endIndex = flatSubHours.findIndex((subHour) => subHour.endTime === endTime);

    if (startIndex === -1 || endIndex === -1) {
      return 1;
    }
    return endIndex - startIndex + 1;
  };

  const isWithinAssignmentRange = (assignment, subHour) => {
    return (
      assignment.day === day.format("YYYY-MM-DD") &&
      subHour.startTime >= assignment.startTime &&
      subHour.endTime <= assignment.endTime
    );
  };

  const handleCellClick = (assignment, subHour) => {
    dispatch(setSelectedDay(day.format("YYYY-MM-DD")));
    dispatch(setSelectedStartTime(assignment ? assignment.startTime : subHour.startTime));
    dispatch(setSelectedEndTime(assignment ? assignment.endTime : subHour.endTime));
    dispatch(setSelectedAssignment(assignment || {}));
    dispatch(setShowAddAssignmentModal(true));
  };

  return (
    <tr>
      <td className="px-1 py-3 border font-semibold text-gray-700">
        {day.format("dddd")}
      </td>
      {hours.map((hour) =>
        hour.subHours.map((subHour) => {
          const assignment = safeAssignments.find(
            (assignment) => isWithinAssignmentRange(assignment, subHour)
          );

          const key = `${subHour.startTime}-${subHour.endTime}`;

          if (assignment && subHour.startTime === assignment.startTime) {
            const spanCount = getSpanCount(assignment.startTime, assignment.endTime);
            return (
              <td
                key={key} // Unique key for assignment
                colSpan={spanCount}
                className="border p-2 cursor-pointer bg-blue-300"
                onClick={() => handleCellClick(assignment, subHour)} // Use helper function here
              >
                <p>{assignment.title}</p>
                <p className="text-gray-600">{assignment.intituleGroupe}</p>
                <p className="text-gray-600">{assignment.salle}</p>
              </td>
            );
          }
          // If no assignmnd, render an empty clickable cell
          return (
            <td 
              key={key} // Unique key for empty cell
              className="border p-2 cursor-pointer"
              onClick={() => handleCellClick(null, subHour)} // Use helper function for empty cell
            />
          );
        })
      )}
    </tr>
  );
};

export default DayRow;
