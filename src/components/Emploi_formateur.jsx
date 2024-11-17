import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo.svg';
import './emploi.css';
import AssignmentModal from './AssignmentModal.jsx';

function Emploi_formateur() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullname = queryParams?.get('formateur');

  const [groups, setGroups] = useState([]);
  const [seances, setSeances] = useState([]);
  const [hours, setHours] = useState([]);
  const [scheduleMap, setScheduleMap] = useState({});
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [filteredSeances, setFilteredSeances] = useState([]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Function to calculate the current week (from Sunday to Saturday)
  function getCurrentWeek() {
    const savedWeek = JSON.parse(localStorage.getItem('currentWeek'));
    if (savedWeek) {
      return savedWeek;
    }
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    return {
      start: startOfWeek,
      end: endOfWeek,
    };
  }

  useEffect(() => {
    axios.get('http://localhost:3000/groupe')
      .then(response => setGroups(response.data))
      .catch(error => console.error("Error fetching groups:", error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/seance')
      .then(response => {
        const filteredData = fullname
          ? response.data.filter(seance => seance.formateur === fullname)
          : response.data;
        setSeances(filteredData);
      })
      .catch(error => console.error("Error fetching seances:", error));
  }, [fullname]);

  useEffect(() => {
    setHours([
      { startTime: '08:00', endTime: '09:00' },
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '12:00', endTime: '13:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '14:00', endTime: '15:00' },
      { startTime: '15:00', endTime: '16:00' },
    ]);
  }, []);

  useEffect(() => {
    const map = {};

    seances.forEach((seance) => {
      const dayName = typeof seance.day === 'number' ? daysOfWeek[seance.day] : seance.day;
      const group = seance.group || seance.groupe;
      const salle = seance.saleName || seance.salle;

      const key = `${dayName}-${seance.startTime}`;
      map[key] = {
        ...seance,
        day: dayName,
        group,
        salle,
      };
    });

    setScheduleMap(map);
  }, [seances]);

  useEffect(() => {
    // Filter seances that are within the current week
    const filteredData = seances.filter((seance) => {
      const seanceDate = new Date(seance.date); // Assuming the seance has a date field
      return seanceDate >= currentWeek.start && seanceDate <= currentWeek.end;
    });
    setFilteredSeances(filteredData);
  }, [seances, currentWeek]);

  const handleCellClick = (day, hour) => {
    const key = `${day}-${hour.startTime}`;
    const seance = scheduleMap[key];
    if (seance) {
      setSelectedSeance(seance);
      setIsEditing(true);
    } else {
      setSelectedSeance({
        day,
        startTime: hour.startTime,
        endTime: hour.endTime,
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSaveSeance = (newSeance) => {
    if (isEditing) {
      axios.put(`http://localhost:8000/seance/${selectedSeance.id}`, newSeance)
        .then(() => {
          setSeances((prev) =>
            prev.map((seance) =>
              seance.id === selectedSeance.id ? newSeance : seance
            )
          );
        });
    } else {
      axios.post('http://localhost:8000/seance', newSeance)
        .then((response) => {
          setSeances((prev) => [...prev, response.data]);
        });
    }
    setShowModal(false);
  };

  const handleDeleteSeance = (id) => {
    axios.delete(`http://localhost:8000/seance/${id}`)
      .then(() => {
        setSeances((prev) => prev.filter((seance) => seance.id !== id));
      });
    setShowModal(false);
  };

  const goToNextWeek = () => {
    const newStartOfWeek = new Date(currentWeek.start);
    newStartOfWeek.setDate(newStartOfWeek.getDate() + 7);

    const newEndOfWeek = new Date(currentWeek.end);
    newEndOfWeek.setDate(newEndOfWeek.getDate() + 7);

    const newWeek = {
      start: newStartOfWeek,
      end: newEndOfWeek,
    };
    setCurrentWeek(newWeek);
    localStorage.setItem('currentWeek', JSON.stringify(newWeek));
  };

  const goToPreviousWeek = () => {
    const newStartOfWeek = new Date(currentWeek.start);
    newStartOfWeek.setDate(newStartOfWeek.getDate() - 7);

    const newEndOfWeek = new Date(currentWeek.end);
    newEndOfWeek.setDate(newEndOfWeek.getDate() - 7);

    const newWeek = {
      start: newStartOfWeek,
      end: newEndOfWeek,
    };
    setCurrentWeek(newWeek);
    localStorage.setItem('currentWeek', JSON.stringify(newWeek));
  };

  return (
    <>
      <h6 className="ofppt">
        <img src={Logo} alt="ofppt" style={{ width: '80px', marginLeft: "30px" }} /><br />
        Souss-Massa<br />
        ISTA AIT MELLOUL
      </h6><br />
      <h1><strong>Emploi du Temps</strong></h1>
      <h5>2024/2025</h5>
      <div className="items">
        <h5>
          <b>Formateur:</b> {fullname || 'All formateurs'}
        </h5>
      </div>
      <div className="flex-1 p-1">
        <div>
          <button className="btn btn-primary" onClick={goToPreviousWeek}>Previous Week</button>
          <span>{`Week of ${new Date(currentWeek.start).toLocaleDateString()} - ${new Date(currentWeek.end).toLocaleDateString()}`}</span>
          <button className="btn btn-primary" onClick={goToNextWeek}>Next Week</button>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center">Time/Day</th>
              {daysOfWeek.slice(1, 6).map((day) => (
                <th key={day} className="text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour, hourIndex) => (
              <tr key={hourIndex}>
                <td className="text-center">{hour.startTime} - {hour.endTime}</td>
                {daysOfWeek.slice(1, 6).map((day) => {
                  const key = `${day}-${hour.startTime}`;
                  const seance = scheduleMap[key];
                  return (
                    <td
                      key={key}
                      className={`text-center ${seance ? 'bg-info text-white' : ''}`}
                      onClick={() => handleCellClick(day, hour)}
                    >
                      {seance ? (
                        <div>
                          <strong>{seance.group}</strong><br />
                          <span>{seance.title}</span><br />
                          <span>{seance.salle}</span>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <AssignmentModal
            seance={selectedSeance}
            isEditing={isEditing}
            groups={groups}
            onSave={handleSaveSeance}
            onDelete={handleDeleteSeance}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </>
  );
}

export default Emploi_formateur;
