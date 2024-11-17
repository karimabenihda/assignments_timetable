import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setSelectedDay,
  setSelectedEndTime,
  setSelectedStartTime,
  setShowAddAssignmentModal,
} from '../redux/slices';

const DayRow = ({ day, hours, seances = [] }) => {
  const dispatch = useDispatch();

  // Create a map for fast lookup of seances by day and startTime
  const seanceMap = seances.reduce((map, seance) => {
    const key = `${seance.day}-${seance.startTime}`;
    map[key] = seance;
    return map;
  }, {});

  // Helper function to get colspan for a seance
  const getSpanCount = (startTime, endTime) => {
    const flatSubHours = hours.flatMap((hour) => hour.subHours);
    const startIndex = flatSubHours.findIndex((subHour) => subHour.startTime === startTime);
    const endIndex = flatSubHours.findIndex((subHour) => subHour.endTime === endTime);

    return startIndex !== -1 && endIndex !== -1 ? endIndex - startIndex + 1 : 1;
  };

  return (
    <tr>
      <td className="px-1 py-3 border font-semibold text-gray-700">
        {day.format('dddd')}
      </td>
      {hours.map((hour) =>
        hour.subHours.map((subHour, subHourIndex) => {
          const key = `${day.format('YYYY-MM-DD')}-${subHour.startTime}`;
          const seance = seanceMap[key];

          // If a seance is found, render it with colspan
          if (seance && subHour.startTime === seance.startTime) {
            const spanCount = getSpanCount(seance.startTime, seance.endTime);
            return (
              <td
                key={key}
                colSpan={spanCount}
                className="border p-2 cursor-pointer bg-blue-100"
                onClick={() => {
                  dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                  dispatch(setSelectedStartTime(seance.startTime));
                  dispatch(setSelectedEndTime(seance.endTime));
                  dispatch(setShowAddAssignmentModal(true));
                }}
              >
                <p><b>{seance.group}</b></p>
                <b className="text-gray-600">{seance.title}</b>
                <p className="text-gray-600">{seance.saleName}</p>
              </td>
            );
          }

          // Skip rendering cells covered by a seance
          const isCovered = seances.some((s) => {
            return (
              s.day === day.format('YYYY-MM-DD') &&
              subHour.startTime >= s.startTime &&
              subHour.startTime < s.endTime
            );
          });

          if (isCovered) {
            return null;
          }

          // Render an empty cell if no seance is found
          return (
            <td
              key={`${subHour.startTime}-${subHour.endTime}-${subHourIndex}`}
              className="border p-2 cursor-pointer"
              onClick={() => {
                dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                dispatch(setSelectedStartTime(subHour.startTime));
                dispatch(setSelectedEndTime(subHour.endTime));
                dispatch(setShowAddAssignmentModal(true));
              }}
            >
            </td>
          );
        })
      )}
    </tr>
  );
};

export default DayRow;
