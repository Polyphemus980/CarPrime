// src/components/RentalForm.jsx

import React, { useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import './RentalForm.css'; 

function RentalForm({ car, onClose }) {
  const [rentForm, setRentForm] = useState({
    startDate: '',
    endDate: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { startDate, endDate } = rentForm;
    if (!startDate) {
      errors.startDate = 'Start date is required.';
    }
    if (!endDate) {
      errors.endDate = 'End date is required.';
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.endDate = 'End date cannot be before start date.';
    }
    return errors;
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const rentData = {
        CarId: car.id,
        StartDate: rentForm.startDate,
        EndDate: rentForm.endDate,
      };
      const res = await axios.post(`https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/Car/${car.id}/rent`, rentData); 

      toast.success('Car rented successfully!', { position: 'top-right', autoClose: 5000 });
      console.log('Received LeaseId:', res.data.LeaseId);
      console.log('Received Message:', res.data.Message);

      onClose(); 
    } catch (error) {
      console.error('Error renting car:', error);
      if (error.response && error.response.data && error.response.data.Message) {
        toast.error(error.response.data.Message, { position: 'top-right', autoClose: 5000 });
      } else {
        toast.error('Failed to rent car.', { position: 'top-right', autoClose: 5000 });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rent-form-modal">
      <div className="rent-form-content">
        <h3>Rent Car: {car.brand} {car.model} ({car.year})</h3>
        <form onSubmit={handleRentSubmit}>
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={rentForm.startDate}
              onChange={handleFormChange}
              required
            />
            {formErrors.startDate && <span className="error-message">{formErrors.startDate}</span>}
          </label>
          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={rentForm.endDate}
              onChange={handleFormChange}
              required
            />
            {formErrors.endDate && <span className="error-message">{formErrors.endDate}</span>}
          </label>
          <div className="form-buttons">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Renting...' : 'Confirm Rent'}
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

export default RentalForm;
