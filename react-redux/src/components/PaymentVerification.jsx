import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentVerification = () => {
  const location = useLocation();
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const reference = query.get('reference');

    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          'http://localhost:3000/api/payments/verify/paystack/subscription',
          { reference },
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

    if (reference) {
      verifyPayment();
    }
  }, [location.search]);

  return (
    <div>
      <h2>Payment Verification</h2>
      {verificationMessage && <p>{verificationMessage}</p>}
    </div>
  );
};

export default PaymentVerification;
