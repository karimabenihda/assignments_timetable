import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


function AfficherFormateur() {
  const [formateurs, setFormateurs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFormateurs, setFilteredFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/formateurs')
      .then(res => {
        setFormateurs(res.data);
        setFilteredFormateurs(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching formateurs');
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const filtered = formateurs.filter(formateur =>
      formateur.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFormateurs(filtered);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Formateurs</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button style={{ backgroundColor: '#007bff' }} className="btn mt-2" onClick={handleSearch}>
  Search
</button>

      </div>
      <div className="row">
        {filteredFormateurs.length > 0 ? (
          filteredFormateurs.map((formateur) => (
            <div key={formateur.code_formateur} className="col-md-4">
              <div className="card ">
                <div className="card-body">
                  <h5 className="card-title"><strong>{formateur.full_name}</strong></h5>
                  <p><strong>Modules:</strong> {formateur.modules.join(", ")}</p>
                  <Link  
  to={`/emploi_formateur?formateur=${formateur?.full_name}&code=${formateur?.code_formateur}`}
  style={{
    textDecoration: 'none',
    color: '#007bff',
    backgroundColor: '#ddd',
    paddingBlock: '10px',
    borderRadius: '10px',
    margingRight:'-11px',
    width: '190px',
    display: 'inline-block' 
  }}
>
  Emploi du Formateur
</Link>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No formateurs found.</div>
        )}
      </div>
    </div>
  );
}

export default AfficherFormateur;
