import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="back-arrow" onClick={() => navigate(-1)}>&#8592;</div>


      <h1 className="about-title">About Us</h1>

      <section className="about-section">
        <h2>Our Service</h2>
        <p>
          We provide a smart, seamless solution for restaurants to enhance their customer experience.
          With our platform, diners can browse your menu, place orders, and pay — all from their mobile device.
        </p>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <p>
          Our mission is to help restaurants increase efficiency, reduce staff workload, and delight guests
          with a smooth ordering experience.
        </p>
      </section>

      <section className="about-section">
        <h2>Join the Future of Dining</h2>
        <p>
          Thousands of restaurants are already using our platform to streamline their service and boost customer satisfaction.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
