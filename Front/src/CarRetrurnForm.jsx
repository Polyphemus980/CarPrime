// src/CarReturnForm.jsx
import React, { useState } from 'react';
import './styles/CarReturnForm.css';

function CarReturnForm({ car, onClose, returnCar }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  function handleReturn(e) {
    e.preventDefault();
    returnCar(car.id, { firstName, lastName, email });
  }

  return (
    <div className="return-form-overlay">
      <div className="return-form">
        <h2>Return Car</h2>
        <div className="car-info">
          <img
            src={`/images/${car.image}`}
            alt={`${car.brand} ${car.model}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          <div className="car-details">
            <h3>
              {car.brand} {car.model} ({car.year})
            </h3>
          </div>
        </div>
        <form onSubmit={handleReturn}>
          <h3>User Information</h3>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Enter your last name"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </label>
          <div className="form-buttons">
            <button type="submit">Confirm Return</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarReturnForm;
