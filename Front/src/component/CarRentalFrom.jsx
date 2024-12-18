// src/components/CarRentalForm.jsx

import React, { useState } from 'react';
import './CarRentalForm.css';

function CarRentalForm({ car, onClose, rentCar }) {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'Description is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const customerData = {
      description,
      photos,
    };
    rentCar(car.Id, customerData);
  };

  return (
    <div className="car-rental-form-container">
      <div className="car-rental-form">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Rent {car.Brand} {car.Name}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="description">
            Description:
            <textarea
              id="description"
              name="description"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </label>

          <label htmlFor="photos">
            Upload Photos:
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              onChange={handlePhotoChange}
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CarRentalForm;
