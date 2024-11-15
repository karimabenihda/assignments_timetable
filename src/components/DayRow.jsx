// DayRow.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedDay, setSelectedEndTime, setSelectedStartTime, setShowAddAssignmentModal } from '../redux/slices';

const DayRow = ({ day, hours, assignments }) => {
  const dispatch = useDispatch();

  const getSpanCount = (startTime, endTime) => {
    const startIndex = hours.findIndex(hour => hour.startTime === startTime);
    const endIndex = hours.findIndex(hour => hour.endTime === endTime);
    return endIndex - startIndex + 1;
  };

  return (
    <tr>
      <td className="px-1 py-5 border font-semibold text-gray-700">
        {day.format('dddd')}
      </td>
      {hours.map((hour, hourIndex) => {
        // Check if an assignment starts at this hour
        const assignment = assignments.find(
          (assignment) =>
            assignment.day === day.format('YYYY-MM-DD') &&
            assignment.startTime === hour.startTime
        );

        // If an assignment is found, render it with colSpan
        if (assignment) {
          const spanCount = getSpanCount(assignment.startTime, assignment.endTime);
          return (
            <td
              key={hourIndex}
              colSpan={spanCount}
              className="border p-2 cursor-pointer bg-blue-100"
              onClick={() => {
                dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                dispatch(setSelectedStartTime(assignment.startTime));
                dispatch(setSelectedEndTime(assignment.endTime));
                dispatch(setShowAddAssignmentModal(true));
              }}
            >
              {assignment.title}
            </td>
          );
        }

        // Check if this cell is covered by a previously rendered assignment
        const isCellCovered = assignments.some((assignment) => {
          const startIndex = hours.findIndex(h => h.startTime === assignment.startTime);
          const endIndex = hours.findIndex(h => h.endTime === assignment.endTime);
          return (
            assignment.day === day.format('YYYY-MM-DD') &&
            hourIndex > startIndex &&
            hourIndex <= endIndex
          );
        });

        // Skip rendering this cell if it is covered
        if (isCellCovered) {
          return null;
        }

        // Render an empty cell
        return (
          <td
            key={hourIndex}
            className="border p-2 cursor-pointer"
            onClick={() => {
              dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
              dispatch(setSelectedStartTime(hour.startTime));
              dispatch(setSelectedEndTime(hour.endTime));
              dispatch(setShowAddAssignmentModal(true));
            }}
          ></td>
        );
      })}
    </tr>
  );
};

export default DayRow;
