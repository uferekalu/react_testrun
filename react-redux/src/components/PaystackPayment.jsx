import React, { useState } from 'react';
import axios from 'axios';

const PaystackPayment = () => {
  const [subscriptionType, setSubscriptionType] = useState('standard');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [authorizationUrl, setAuthorizationUrl] = useState('');

  const handlePayment = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/payments/paystack/subscription',
        {
          subscriptionType,
          email,
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic2Vzc2lvbklkIjo1LCJpYXQiOjE3MjIyMTgyNzQsImV4cCI6MTcyMjMwNDY3NH0.KynzfD1vJ6Bg0yFIp4ZGAFlWiVfJG78DepLUVTvlGKw`,
          },
        },
      );

      setAuthorizationUrl(data.authorization_url);
      setReference(data.reference);
      
      // Redirect to Paystack authorization URL
    //   window.location.href = data.authorization_url;
    } catch (error) {
      console.error('Error creating Paystack subscription:', error);
    }
  };

  const handleVerification = async () => {
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/payments/verify/paystack/subscription',
        {
          reference,
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic2Vzc2lvbklkIjo1LCJpYXQiOjE3MjIyMTgyNzQsImV4cCI6MTcyMjMwNDY3NH0.KynzfD1vJ6Bg0yFIp4ZGAFlWiVfJG78DepLUVTvlGKw`,
          },
        },
      );
      setVerificationMessage(
        data.valid ? 'Verification successful!' : 'Verification failed.',
      );
    } catch (error) {
      console.error('Error verifying Paystack subscription:', error);
    }
  };

  return (
    <div>
      <h2>Paystack Payment</h2>
      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Subscription Type:
          <select value={subscriptionType} onChange={(e) => setSubscriptionType(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit">Pay with Paystack</button>
      </form>
      {authorizationUrl && (
        <div>
          <p>Click the button below to complete your payment:</p>
          <a href={authorizationUrl} target="_blank" rel="noopener noreferrer">
            Complete Payment
          </a>
        </div>
      )}
      {reference && (
        <div>
          <button onClick={handleVerification}>Verify Payment</button>
          {verificationMessage && <p>{verificationMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default PaystackPayment;
