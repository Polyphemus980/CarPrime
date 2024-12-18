// src/components/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './HomePage.css';
import CarRentalForm from './CarRentalFrom';
import { toast } from 'react-toastify';

function HomePage() {
  //const { user } = useContext(UserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  const fetchAvailableCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/Car');
      setCars(response.data);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load available cars.');
    } finally {
      setLoading(false);
    }
  };

  const handleRentCar = async (carId, customerData) => {
    try {
      const formData = new FormData();
      formData.append('description', customerData.description);
      customerData.photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      //const response = await axios.post(`/Car/${carId}/rent`, formData, {
      //  headers: {
      //    'Content-Type': 'multipart/form-data',
      //  },
      //});

      toast.success('Car rented successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchAvailableCars();
      setSelectedCar(null);
    } catch (error) {
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
    }
  };

  return (
    <div className="home-container">
      <h1>Available Cars</h1>
      {loading ? (
        <div className="spinner">
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
            <div key={car.Id} className="car-card">
              <img
                src={`/images/${car.image}`}
                alt={`${car.Brand} ${car.Name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h2>{car.Brand} {car.Name}</h2>
              <p>Year: {car.Year}</p>
              <p>Status: {car.Status}</p>
              {car.Status === 'Available' && (
                <button onClick={() => setSelectedCar(car)}>Rent Now</button>
              )}
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
