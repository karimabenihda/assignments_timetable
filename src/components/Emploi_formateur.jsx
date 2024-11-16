import React, { useState, useEffect } from 'react';
import Week from './Week.jsx';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import './emploi.css';
import AssignmentModal from './AssignmentModal.jsx';
import axios from 'axios';

function Emploi_formateur() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullname = queryParams?.get('full_name');
  
  const [groups, setGroups] = useState([]);
  const [seances, setSeances] = useState([]); // State for storing seances

  // Fetch groups (already in your code)
  useEffect(() => {
    axios.get('http://localhost:3000/groupe')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error("Error fetching groups: ", error);
      });
  }, []);

  // Fetch seances for the selected formateur
  useEffect(() => {
    if (fullname) {
      axios.get(`http://localhost:8000/seances?formateur=${fullname}`)
        .then(response => {
          setSeances(response.data.seances); // Assuming your response contains 'seances' data
        })
        .catch(error => {
          console.error("Error fetching seances: ", error);
        });
    }
  }, [fullname]); // Re-run the effect when fullname changes

  return (
    <>
      <h6 className="ofppt">
        <img src={Logo} alt="ofppt" style={{ width: '80px', marginLeft: "30px" }} /> <br />
        Souss-Massa <br />
        ISTA AIT MELLOUL
      </h6><br />
      <h1>
        <strong>Emploi du Temps</strong>
      </h1>
      <h5>2024/2025</h5>
      <div className="items">
        <h5>
          <b>Formateur: </b>
          {fullname}
        </h5>
      </div>
      <div className="flex-1 p-1">
        <Week seances={seances} /> 
        <AssignmentModal groups={groups} />
      </div>
    </>
  );
}

export default Emploi_formateur;
