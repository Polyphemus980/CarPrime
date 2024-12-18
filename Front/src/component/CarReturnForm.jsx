// src/components/CarReturnForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './CarReturnForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CarReturnForm({ car, onClose, returnCar }) {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }

      const API_URL = `https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/car/${car.id}/return`;

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Car has been successfully returned!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });

      if (returnCar) {
        returnCar(car.id);
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error returning car:', err);
      if (err.response) {
        toast.error(`Failed to return car: ${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else if (err.request) {
        toast.error('No response from the server. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else {
        toast.error(`Error: ${err.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="car-return-form-overlay">
      <div className="car-return-form">
        <h2>Return {car.brand} {car.model}</h2>
        <form onSubmit={handleSubmit}>
          <label>
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

          <label>
            Upload Photos:
            <input
              id="photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(e.target.files)}
              required
            />
            {errors.photos && <span className="error-message">{errors.photos}</span>}
          </label>

          <div className="form-buttons">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Return'}
            </button>
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarReturnForm;
