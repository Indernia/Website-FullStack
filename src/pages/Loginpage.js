import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Loginpage.css';
import { BASE_URL } from "../config";


const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    try {
        const response = await fetch(`${BASE_URL}/adminUsers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Temporary storage of login inforation
        localStorage.setItem("accessToken", data.access_token);
  
        navigate("/restaurant");
      } else {
        alert(data.error || "Email/Password is incorrect. Please try again");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="login-page">
      <div className="back-arrow" onClick={() => navigate(-1)}>
        &#8592;
      </div>

      <div className="login-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" required />

          <button type="submit" className="login-btn">Login</button>
        </form>


      </div>

      <div className="logo">
        <img src="/favicon.ico" alt="Logo" className="logo-image" />
      </div>
    </div>
  );
};

export default LoginPage;
