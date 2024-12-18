// src/components/ReturnsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import './ReturnsPage.css';
import CarReturnForm from './CarReturnForm';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

function ReturnsPage() {
  //const { user } = useContext(UserContext);
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
      const response = await axios.get('/Car/rented');
      setRentals(response.data);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError('Failed to load your rentals.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnCar = async (leaseId, customerData) => {
    try {
      const formData = new FormData();
      formData.append('description', customerData.description);
      customerData.photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      await axios.post(`/Lease/${leaseId}/review`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Car returned successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchUserRentals();
      setSelectedRental(null);
    } catch (error) {
      console.error('Error returning car:', error);
      if (error.response) {
        toast.error(`Returning failed: ${error.response.data.Message || error.response.data}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      } else if (error.request) {
        toast.error('No response from the server. Please try again later.', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error(`Error: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="returns-container">
      <h1>Your Rentals</h1>
      {loading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rentals.length === 0 ? (
        <p>You have no rentals to return.</p>
      ) : (
        <div className="rental-list">
          {rentals.map((rental) => (
            <div key={rental.LeaseId} className="rental-card">
              <img
                src={`/images/${rental.car.image}`}
                alt={`${rental.Brand} ${rental.Name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h2>{rental.Brand} {rental.Name}</h2>
              <p>Year: {rental.Year}</p>
              <p>Status: {rental.Status}</p>
              {rental.Status === 'CurrentlyRented' && (
                <button onClick={() => setSelectedRental(rental)}>Return Car</button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedRental && (
        <CarReturnForm
          leaseId={selectedRental.LeaseId}
          onClose={() => setSelectedRental(null)}
          returnCar={handleReturnCar}
        />
      )}
    </div>
  );
}

export default ReturnsPage;
