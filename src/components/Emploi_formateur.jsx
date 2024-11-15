import React from 'react'
import Week from "./Week.jsx"
import { useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import "./emploi.css"
import AssignmentModal from "./AssignmentModal.jsx"
function Emploi_formateur() {
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fullname = queryParams.get('full_name');
  
  return (
<>
<h6 className="ofppt">
        <img src={Logo} alt="ofppt" style={{ width: '90px' }} /> <br />
        Souss-Massa <br />
        ISTA AIT MELLOUL
      </h6>
      <h1>
        <strong>Emploi du Temps</strong>
      </h1>
      <h5>2024/2025</h5>
      <div className="items">
        <h5>
       
        </h5>
        <h5>
          <b>Formateur: </b>
          {fullname}
        </h5>
      </div>
   <div className="flex-1 p-6">
      <Week/>
      <AssignmentModal/>
    </div>
</>
    
  
  )
}

export default Emploi_formateur
