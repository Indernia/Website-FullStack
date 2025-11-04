import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Successpage.css'
import { BASE_URL } from "../../config";


const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    let intervalId;
    let retryCount = 0;
    const maxRetries = 20;
    const verifyPayment = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/paymentStatus`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "sessionID": sessionId })
        });

        const data = await res.json();

        if (data.status === 'paid' || data.status === 'unpaid') {
          setStatus(data.status);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error verifying payment: ", error); // Logging error to the console
      }
      retryCount++;
      if (retryCount >= maxRetries) {
        clearInterval(intervalId);
        setStatus('error');
      }
    };

    if (sessionId) {
        intervalId = setInterval(verifyPayment, 1500);
        verifyPayment();
    }
    return () => clearInterval(intervalId);
  }, [sessionId]);

  if (status === 'pending') return <p>Verifying your payment...</p>;

  return (
    <div className="success-container">
    {status === 'paid' ? (
      <>
        <div className="success-icon">✅</div>
        <h2 className="success-message">Thank you! Your payment was successful.</h2>
        <p className="success-subtext">You will receive a confirmation email shortly.</p>
      </>
    ) : (
      <>
        <div className="success-icon">❌</div>
        <h2 className="error-message">Payment failed or could not be verified.</h2>
        <p className="success-subtext">Please try again or contact support.</p>
      </>
    )}
  </div>
);
};

export default PaymentSuccess;
