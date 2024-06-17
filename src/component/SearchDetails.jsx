import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDrugDetails } from '../api/fetchUtils';
import "./searchDetails.css";

const SearchDetails = () => {
  const { rxcui, name, synonym } = useParams();
  const [ndc, setNDC] = useState([]);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const ndcDetails = await fetchDrugDetails(rxcui,name);
            setNDC(ndcDetails);
          } catch (err) {
            setError(err.message);
          }
        };
    
        fetchData();
      }, [name, rxcui]);
    
      if (error) {
        return <div className="error">{error}</div>;
      }
      return (
        <div className="drug-details-page">
          <div>
            <div>
            <h1>Drug Details</h1>
            <p>Name: {name}</p>
            <p>Synonym: {synonym}</p>
            <p>RXCUI: {rxcui}</p>
            </div>

        </div>
          <div className="results">
            <h3>Associated NDCs</h3>
            <ul>
              {ndc && ndc.map((ndc, index) => (
                <li key={index}>{ndc}</li>
              ))}
            </ul>
          </div>
        </div>
      );
};

export default SearchDetails;