// src/component/RegistrationForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { toast } from 'react-toastify';

function RegistrationForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    licenceIssuedDate: '',
    country: '',
    city: '',
    address: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address.';
    }
    if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required.';
    if (!formData.licenceIssuedDate) newErrors.licenceIssuedDate = 'Licence issued date is required.';
    if (!formData.country.trim()) newErrors.country = 'Country is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);
    try {
      const API_URL = './api/Auth/register';
      const response = await axios.post(API_URL, formData);
      const token = response.data.Token;
      toast.success('Registration successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      onSwitchToLogin();
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data.Message || error.response.data}`, {
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="firstName">
          First Name:
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </label>

        <label htmlFor="lastName">
          Last Name:
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </label>

        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>

        <label htmlFor="birthdate">
          Birthdate:
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
          {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}
        </label>

        <label htmlFor="licenceIssuedDate">
          Licence Issued Date:
          <input
            type="date"
            id="licenceIssuedDate"
            name="licenceIssuedDate"
            value={formData.licenceIssuedDate}
            onChange={handleChange}
            required
          />
          {errors.licenceIssuedDate && <span className="error-message">{errors.licenceIssuedDate}</span>}
        </label>

        <label htmlFor="country">
          Country:
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Enter your country"
            value={formData.country}
            onChange={handleChange}
            required
          />
          {errors.country && <span className="error-message">{errors.country}</span>}
        </label>

        <label htmlFor="city">
          City:
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </label>

        <label htmlFor="address">
          Address:
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button className="switch-button" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </div>
  );
}

export default RegistrationForm;
