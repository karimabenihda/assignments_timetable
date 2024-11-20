import React, { useState, useEffect } from 'react';
import Week from './Week.jsx';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import './emploi.css';
import AssignmentModal from './AssignmentModal.jsx';
import axios from 'axios';

function EmploiFormateur() {
  const location = useLocation();
  const [fullname, setFullname] = useState('');
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const formateurFromUrl = queryParams.get('formateur');

    if (formateurFromUrl) {
      localStorage.setItem('formateur', formateurFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const formateurFromStorage = localStorage.getItem('formateur');
    setFullname(formateurFromStorage || '');
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/groupe')
      .then(response => setGroups(response.data))
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  useEffect(() => {
    if (fullname) {
      setLoading(true);
      setAssignments([]); 

      axios.get('http://localhost:8000/assignements')
        .then(response => {
          const allAssignments = response.data?.assignements || [];
          const filteredAssignments = allAssignments.filter(
            assignment => assignment.formateur === fullname
          );
          setAssignments(filteredAssignments);
        })
        .catch(error => console.error('Error fetching assignments:', error))
        .finally(() => setLoading(false));
    } else {
      setAssignments([]);
    }
  }, [fullname]); 

  return (
    <>
      <h6 className="ofppt">
        <img src={Logo} alt="ofppt" style={{ width: '80px', marginLeft: '30px' }} />
        <br />
        Souss-Massa
        <br />
        ISTA AIT MELLOUL
      </h6>
      <br />
      <h1>
        <strong>Emploi du Temps</strong>
      </h1>
      <h5>2024/2025</h5>
      <div className="items">
        <h5>
          <b>Formateur: </b>
          {fullname || 'Aucun formateur sélectionné'}
        </h5>
      </div>
      <div className="flex-1 p-1">
        {loading ? (
          <p>Loading assignments...</p>
        ) : (
          <>
            <Week />
            <AssignmentModal groups={groups} assignments={assignments} />
          </>
        )}
      </div>
    </>
  );
}

export default EmploiFormateur;
