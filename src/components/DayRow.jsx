import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedDay, setSelectedEndTime, setSelectedStartTime, setShowAddAssignmentModal } from '../redux/slices';

const DayRow = ({ day, hours, assignments }) => {
  const dispatch = useDispatch();

  const getSpanCount = (startTime, endTime) => {
    const flatSubHours = hours.flatMap(hour => hour.subHours);
    const startIndex = flatSubHours.findIndex(subHour => subHour.startTime === startTime);
    const endIndex = flatSubHours.findIndex(subHour => subHour.endTime === endTime);

    if (startIndex === -1 || endIndex === -1) {
      return 1; 
    }

    return endIndex - startIndex + 1;
  };

  const isWithinAssignmentRange = (assignment, subHour) => {
    return (
      assignment.day === day.format('YYYY-MM-DD') &&
      subHour.startTime >= assignment.startTime &&
      subHour.endTime <= assignment.endTime
    );
  };

  return (
    <tr>
      <td className="px-1 py-3 border font-semibold text-gray-700">
        {day.format('dddd')}
      </td>
      {hours.map((hour) => (
        hour.subHours.map((subHour, subHourIndex) => {
          const assignment = assignments.find(
            (assignment) => isWithinAssignmentRange(assignment, subHour)
          );

          if (assignment && subHour.startTime === assignment.startTime) {
            const spanCount = getSpanCount(assignment.startTime, assignment.endTime);
            return (
              <td
                key={`${subHour.startTime}-${subHour.endTime}`}
                colSpan={spanCount}
                className="border p-2 cursor-pointer bg-blue-100"
                onClick={() => {
                  dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                  dispatch(setSelectedStartTime(assignment.startTime));
                  dispatch(setSelectedEndTime(assignment.endTime));
                  dispatch(setShowAddAssignmentModal(true));
                }}
              >
                <p ><b>{assignment.group}</b></p>
                <b className="text-gray-600">{assignment.title}</b>
                <p className="text-gray-600">{assignment.saleName}</p>
              </td>
            );
          }

          const isCellCovered = assignments.some((assignment) => {
            const flatSubHours = hours.flatMap(hour => hour.subHours);
            const startIndex = flatSubHours.findIndex(subHour => subHour.startTime === assignment.startTime);
            const endIndex = flatSubHours.findIndex(subHour => subHour.endTime === assignment.endTime);
            const currentIndex = flatSubHours.findIndex(s => s.startTime === subHour.startTime);

            return (
              assignment.day === day.format('YYYY-MM-DD') &&
              currentIndex > startIndex &&
              currentIndex <= endIndex
            );
          });

          if (isCellCovered) {
            return null;
          }

          return (
            <td
              key={`${subHour.startTime}-${subHour.endTime}-${subHourIndex}`}
              className="border p-2 cursor-pointer"
              onClick={() => {
                if (subHour.startTime > subHour.endTime) {
                  alert("Start time cannot be later than end time!"); 
                  return; 
                }
                dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                dispatch(setSelectedStartTime(subHour.startTime));
                dispatch(setSelectedEndTime(subHour.endTime));
                dispatch(setShowAddAssignmentModal(true));
              }}
            >
            </td>
          );
        })
      ))}
    </tr>
  );
};

export default DayRow;
