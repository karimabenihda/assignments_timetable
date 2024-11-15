import React from 'react';
import { Link } from 'react-router-dom'; 
// import '../index.css';
import './page.css';

function Page() {
  return (
    <div className='container'>
      <div className="card text-start">
        <img
          className="card-img-top"
          src="https://img.icons8.com/?size=100&id=38HJBFwphJ3I&format=png&color=000000"
          alt="formateur"
        />
        <div className="card-body">
          <h4 className="card-title">
          <Link to="/afficher_formateur">Formateur</Link>
            </h4>
        </div>
      </div>

      <div className="card text-start">
        <img
          className="card-img-top"
          src="https://img.icons8.com/?size=100&id=43464&format=png&color=000000"
          alt="stagiaire"
        />
        <div className="card-body">
          <h4 className="card-title">
            <Link to="/afficher_groupe_stagiaire">Stagiaire</Link>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Page;
