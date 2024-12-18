// src/components/ReturnsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ReturnsPage.css';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

function ReturnsPage() {
  const { user } = useContext(UserContext);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleReturn = async (rentalId) => {
    try {
      await axios.post(`./api/rentals/${rentalId}/return`);
      toast.success('Car returned successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchUserRentals();
    } catch (err) {
      console.error('Error returning car:', err);
      toast.error('Failed to return car. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="returns-container">
      <h1>Your Rentals</h1>
      {loading ? (
        <div className="spinner">
          {/* */}
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
              <button onClick={() => handleReturn(rental.id)}>Return Car</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReturnsPage;
