import React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import DayRow from './DayRow';

export default function Week({ seances = [] }) {
  // Get hours from Redux, or use default hours if none are provided
  const reduxHours = useSelector((state) => state.calendar.hours);
  const hours = reduxHours?.length ? reduxHours : [
    { startTime: '08:00', endTime: '09:00' },
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '12:00', endTime: '13:00' },
    { startTime: '13:00', endTime: '14:00' },
    { startTime: '14:00', endTime: '15:00' },
    { startTime: '15:00', endTime: '16:00' },
  ];

  // Define the days of the current week (Monday to Sunday)
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    dayjs().startOf('week').add(i, 'day')
  );

  // Group the seances by the day of the week
  const seancesByDay = daysOfWeek.reduce((acc, day) => {
    const formattedDay = day.format('YYYY-MM-DD');
    acc[formattedDay] = seances.filter((seance) =>
      dayjs(seance.day).format('YYYY-MM-DD') === formattedDay
    );
    return acc;
  }, {});

  // Safe logging for debugging (only log in development mode)
  if (process.env.NODE_ENV === 'development') {
    console.log('Seances:', seances);
    console.log('Hours:', hours);
    console.log('Seances Grouped by Day:', seancesByDay);
  }

  return (
    <div className="overflow-x-auto p-2">
      <div className="inline-block min-w-full overflow-hidden rounded-lg border border-gray-300 shadow-md">
        <table className="min-w-full border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="px-1 py-1 border rounded-tl-lg">Day</th>
              {hours.map((hour, index) => (
                <th key={index} colSpan={2} className="px-1 py-1 border font-semibold">
                  {hour.startTime} - {hour.endTime}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day, dayIndex) => (
              <DayRow
                key={dayIndex}
                day={day}
                hours={hours}
                seances={seancesByDay[day.format('YYYY-MM-DD')] || []}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
