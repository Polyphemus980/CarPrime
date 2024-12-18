// src/components/HomePage.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './HomePage.css';
import CarRentalForm from './CarRentalFrom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

function HomePage() {
  const { user } = useContext(UserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCar, setSelectedCar] = useState(null); // For Rental Form

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  const fetchAvailableCars = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint to fetch available cars
      const response = await axios.get('./api/cars/available');
      setCars(response.data);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load available cars.');
    } finally {
      setLoading(false);
    }
  };

  const handleRentCar = (carId, customerData) => {
    // Implement the logic to rent a car
    // For example, send a POST request to rent the car
    axios.post(`./api/cars/${carId}/rent`, customerData)
      .then(response => {
        toast.success('Car rented successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        // Refresh available cars
        fetchAvailableCars();
        // Close the rental form
        setSelectedCar(null);
      })
      .catch(error => {
        console.error('Error renting car:', error);
        if (error.response) {
          toast.error(`Renting failed: ${error.response.data.Message || error.response.data}`, {
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
      });
  };

  return (
    <div className="home-container">
      <h1>Available Cars</h1>
      {loading ? (
        <div className="spinner">
          {/* Spinner can be a CSS-based loader */}
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : cars.length === 0 ? (
        <p>No cars available for rent at the moment.</p>
      ) : (
        <div className="car-list">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              <img
                src={`/images/${car.image}`}
                alt={`${car.brand} ${car.model}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h2>{car.brand} {car.model}</h2>
              <p>Year: {car.year}</p>
              <p>Price per day: ${car.pricePerDay}</p>
              <button onClick={() => setSelectedCar(car)}>Rent Now</button>
            </div>
          ))}
        </div>
      )}

      {selectedCar && (
        <CarRentalForm
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          rentCar={handleRentCar}
        />
      )}
    </div>
  );
}

export default HomePage;
