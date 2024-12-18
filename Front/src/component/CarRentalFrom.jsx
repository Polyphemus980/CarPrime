// src/components/ReturnsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ReturnsPage.css';
import CarReturnForm from './CarReturnForm';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

function ReturnsPage() {
  const { user } = useContext(UserContext);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRental, setSelectedRental] = useState(null); 

  useEffect(() => {
    fetchUserRentals();
  }, []);

  const fetchUserRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`./api/rentals?email=${user.email}`);
      setRentals(response.data);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError('Failed to load your rentals.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnCar = (carId, customerData) => {
    toast.success('Car returned successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
    fetchUserRentals();
    setSelectedRental(null);
  };

  return (
    <div className="returns-container">
      <h1>Your Rentals</h1>
      {loading ? (
        <div className="spinner">
          {/* Spinner can be a CSS-based loader */}
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rentals.length === 0 ? (
        <p>You have no rentals.</p>
      ) : (
        <div className="rental-list">
          {rentals.map((rental) => (
            <div key={rental.id} className="rental-card">
              <img
                src={`/images/${rental.car.image}`}
                alt={`${rental.car.brand} ${rental.car.model}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h2>{rental.car.brand} {rental.car.model}</h2>
              <p>Rental Date: {new Date(rental.rentalDate).toLocaleDateString()}</p>
              <p>Due Date: {new Date(rental.dueDate).toLocaleDateString()}</p>
              <button onClick={() => setSelectedRental(rental)}>Return Car</button>
            </div>
          ))}
        </div>
      )}

      {selectedRental && (
        <CarReturnForm
          car={selectedRental.car}
          onClose={() => setSelectedRental(null)}
          returnCar={handleReturnCar}
        />
      )}
    </div>
  );
}

export default ReturnsPage;
