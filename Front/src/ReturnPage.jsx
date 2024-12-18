// src/ReturnsPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './styles/ReturnsPage.css';
import CarReturnForm from './CarReturnForm';

function ReturnsPage() {
  const [carsToReturn] = useState([
    {
      id: 1,
      brand: 'Toyota',
      model: 'Camry',
      year: 2021,
      image: 'toyota_camry.jpg',
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      image: 'honda_civic.jpg',
    },
    {
      id: 3,
      brand: 'Ford',
      model: 'Mustang',
      year: 2020,
      image: 'ford_mustang.jpg',
    },
  ]);

  const [selectedCar, setSelectedCar] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [error, setError] = useState(null);

  function returnCar(carId, returnData) {
    axios
      .post(`https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/car/${carId}/return`, returnData)
      .then(() => {
        alert('Car has been successfully returned!');
        setShowReturnForm(false);
      })
      .catch(() => {
        setError('There was a problem returning the car.');
      });
  }

  return (
    <div className="returns-container">
      <h1>Return Your Car</h1>
      {error && <p className="error">{error}</p>}
      <div className="returns-list">
        {carsToReturn.map((car) => (
          <div key={car.id} className="return-car-card">
            <img
              src={`/images/${car.image}`}
              alt={`${car.brand} ${car.model}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
            <h2>
              {car.brand} {car.model} ({car.year})
            </h2>
            <button
              onClick={() => {
                setSelectedCar(car);
                setShowReturnForm(true);
              }}
            >
              Return
            </button>
          </div>
        ))}
      </div>
      {showReturnForm && selectedCar && (
        <CarReturnForm
          car={selectedCar}
          onClose={() => setShowReturnForm(false)}
          returnCar={returnCar}
        />
      )}
    </div>
  );
}

export default ReturnsPage;
