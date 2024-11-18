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
  const fullname = queryParams?.get('formateur');
    const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/groupe')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error("Error fetching groups: ", error);
      });
  }, []);

  return (
    <>      
   
      <h6 className="ofppt">
        <img src={Logo} alt="ofppt" style={{ width: '80px', marginLeft: "30px" }} /> <br />
       <br />
        
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
        <Week />
        <AssignmentModal groups={groups} />
      </div>
    </>
  );
}

export default Emploi_formateur;
