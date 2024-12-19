// src/components/RentCar.jsx

import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import './RentCar.css';

function RentCar() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentingCarId, setRentingCarId] = useState(null);
  const [rentForm, setRentForm] = useState({
    startDate: '',
    endDate: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/cars');
      setCars(res.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to fetch cars.', { position: 'top-right', autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (carId) => {
    setRentingCarId(carId);
    setRentForm({
      startDate: '',
      endDate: '',
    });
    setFormErrors({});
  };

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
        CarId: rentingCarId,
        StartDate: rentForm.startDate,
        EndDate: rentForm.endDate,
      };
      const res = await axios.post('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/rent', rentData); 

      toast.success('Car rented successfully!', { position: 'top-right', autoClose: 5000 });
      console.log('Received LeaseId:', res.data.LeaseId);
      console.log('Received Message:', res.data.Message);

      fetchCars();
      setRentingCarId(null);
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

  if (loading) {
    return <div>Loading cars...</div>;
  }

  return (
    <div className="rent-car-container">
      <h2>Available Cars for Rent</h2>
      <table className="cars-table">
        <thead>
          <tr>
            <th>Car ID</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Year</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.CarId}>
              <td>{car.CarId}</td>
              <td>{car.Brand}</td>
              <td>{car.Name}</td>
              <td>{car.Year}</td>
              <td>{car.Status}</td>
              <td>
                {car.Status === 'Available' ? (
                  <button onClick={() => handleRentClick(car.CarId)}>Rent</button>
                ) : (
                  'Not Available'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rental Form Modal */}
      {rentingCarId && (
        <div className="rent-form-modal">
          <div className="rent-form-content">
            <h3>Rent Car ID: {rentingCarId}</h3>
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
                <button type="button" onClick={() => setRentingCarId(null)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentCar;
