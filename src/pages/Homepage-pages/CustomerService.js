import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerService.css';

const CustomerService = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
  };

  return (
    <div className="customer-service-page">
      <div className="back-arrow" onClick={() => navigate(-1)}>&#8592;</div>

      <div className="customer-service-container">
        <h1>Customer Service</h1>
        <p>Have questions or need help? Fill out the form below or email us directly at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>

        <form onSubmit={handleSubmit} className="support-form">
          <label>Name</label>
          <input type="text" required placeholder="Your name" />

          <label>Email</label>
          <input type="email" required placeholder="Your email" />

          <label>Message</label>
          <textarea rows="5" required placeholder="Describe your issue or question..." />

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerService;
