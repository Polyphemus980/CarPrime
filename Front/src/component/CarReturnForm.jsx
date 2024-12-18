// src/components/CarReturnForm.jsx

import React, { useState } from 'react';
import './CarReturnForm.css';

function CarReturnForm({ leaseId, onClose, returnCar }) {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }
    if (photos.length === 0) {
      newErrors.photos = 'At least one photo is required.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    const customerData = {
      description,
      photos,
    };
    returnCar(leaseId, customerData);
  };

  return (
    <div className="car-return-form-container">
      <div className="car-return-form">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Return Car</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="description">
            Description of Car's State:
            <textarea
              id="description"
              name="description"
              placeholder="Describe the condition of the car upon return"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
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
              required
            />
            {errors.photos && <span className="error-message">{errors.photos}</span>}
          </label>

          <button type="submit">Submit Return</button>
        </form>
      </div>
    </div>
  );
}

export default CarReturnForm;
