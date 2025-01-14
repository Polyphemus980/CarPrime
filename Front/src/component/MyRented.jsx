// src/component/MyRented.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import './MyRented.css';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import CarReturnForm from './CarReturnForm'; 

function MyRented() {
  const { user } = useContext(UserContext);
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    fetchUserRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/Car/rented',
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRentedCars(response.data);
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

      await axios.post(
        `https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/Lease/${leaseId}/review`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success('Car returned successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchUserRentals();
      setSelectedRental(null);
    } catch (error) {
      console.error('Error returning car:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.Message
      ) {
        toast.error(error.response.data.Message, {
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
    <div className="myrented-container">
      <h1>Your Rentals</h1>
      {loading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rentedCars.length === 0 ? (
        <p>You have no rentals to return.</p>
      ) : (
        <div className="rental-list">
          {rentedCars.map((rental) => (
            <div key={rental.LeaseId} className="rental-card">
              {/* Conditionally render the image only if it hasn't failed to load */}
              {rental.car.image && (
                <img
                  src={`/images/${rental.car.image}`}
                  alt={`${rental.car.Brand} ${rental.car.Name}`}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback fails
                    e.target.src = '/data/image.jpg'; // Path to the local fallback image
                  }}
                />
              )}
              <h2>
                {rental.car.Brand} {rental.car.Name}
              </h2>
              <p>Year: {rental.car.Year}</p>
              <p>Status: {rental.Status}</p>
              {rental.Status === 'CurrentlyRented' && (
                <button onClick={() => setSelectedRental(rental)}>
                  Return Car
                </button>
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

export default MyRented;
