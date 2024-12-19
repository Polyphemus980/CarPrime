// src/components/MyRented.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import './MyRented.css';
import { UserContext } from '../context/UserContext';

function MyRented() {
  const { user } = useContext(UserContext);
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRentedCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRentedCars = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/car/Car/rented'); 
      console.log('Rented Cars API Response:', res.data);
      if (Array.isArray(res.data)) {
        setRentedCars(res.data);
      } else {
        setError('Invalid data format from API.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rented cars:', error);
      setError('Failed to fetch rented cars.');
      setLoading(false);
    }
  };

  return (
    <div className="myrented-container">
      <h1>My Rented Cars</h1>

      {loading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rentedCars.length === 0 ? (
        <p>You have not rented any cars yet.</p>
      ) : (
        <div className="rented-car-list">
          {rentedCars.map((car) => (
            <div key={car.LeaseId} className="rented-car-card">
              <img
                src={`/images/${car.Image}`}
                alt={`${car.Brand} ${car.Name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <div className="car-details">
                <h2>
                  {car.Brand} {car.Name} ({car.Year})
                </h2>
                <p>{car.Description}</p>
                <p>Features: {car.Properties.join(', ')}</p>
                <p>Rental Period:</p>
                <ul>
                  <li>Start Date: {new Date(car.StartDate).toLocaleDateString()}</li>
                  <li>End Date: {new Date(car.EndDate).toLocaleDateString()}</li>
                </ul>
                <p>Status: {car.Status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRented;
