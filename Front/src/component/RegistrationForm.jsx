// src/component/RegistrationForm.jsx
import React, { useState, useContext } from 'react';
import './RegistrationForm.css';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

function RegistrationForm({ onSwitchToLogin }) {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailFromLogin = queryParams.get('email') || '';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: emailFromLogin,
    birthdate: '',
    licenceIssuedDate: '',
    country: '',
    city: '',
    address: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const specialWorkerEmail = 'jangaska00@gmail.com';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setSubmitting(true);

    const formDataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      birthdate: formData.birthdate, 
      licenceIssuedDate: formData.licenceIssuedDate, 
      country: formData.country,
      city: formData.city,
      address: formData.address,
    };

    axios.post('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/api/Auth/register', formDataToSend)
      .then(res => {
        const { Token } = res.data;
        const isWorker = formData.email.toLowerCase() === specialWorkerEmail;
        const userData = {
          token: Token,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          isWorker,
        };
        login(userData);
        navigate('/HomeUser');
      })
      .catch(error => {
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
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="registration-form-container">
      <h2>Create an Account</h2>
      <div className="separator">OR</div>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="firstName">
          First Name:
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
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
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
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
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={emailFromLogin !== ''}
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
            onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
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
            onChange={(e) => setFormData({...formData, licenceIssuedDate: e.target.value})}
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
            onChange={(e) => setFormData({...formData, country: e.target.value})}
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
            onChange={(e) => setFormData({...formData, city: e.target.value})}
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
            onChange={(e) => setFormData({...formData, address: e.target.value})}
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
