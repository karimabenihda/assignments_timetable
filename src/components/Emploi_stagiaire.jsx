import React from 'react'
import Week from "./Week.jsx"
import { useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import "./emploi.css"
import AssignmentModal from "./AssignmentModal.jsx"
function Emploi_stagiaire() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const intituleGroupe= queryParams.get('intituleGroupe');
    const filiere= queryParams.get('filiere');
    const [formateurs, setFormateurs] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:5000/formateurs')
        .then(response => {
          setFormateurs(response.data); 
        })
        .catch(error => {
          console.error("Error fetching formateurs: ", error);
        });
    }, []);
  
  return (
<>
<h6 className="ofppt">
        <img src={Logo} alt="ofppt" style={{ width: '90px' }} /> <br />
        Souss-Massa <br />
        ISTA AIT MELLOUL
      </h6><br />
      <h1>
        <strong>Emploi du Temps</strong>
      </h1>
      <h5>2024/2025</h5>
      <div className="items">
        <h5>
        <b>Filiere: </b>
          {filiere}
        </h5>
        <h5>
          <b>Groupe: </b>
          {intituleGroupe}
        </h5>
      </div> 
       <div className="flex-1 p-1">
      <Week/>
      <AssignmentModal formateurs={formateurs}/>
    </div>
  
    </>
  
  )
}

export default Emploi_stagiaire
