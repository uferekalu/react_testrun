import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51GyLKTD8bKf8QQtz5VPgmCbpvqrXJgAUMNIXkz41l8iqnYymMCPo9ePEDhMiFRcMXpoQzXIjw7F8WKjq7XhYVwtY00skOdOq55');

const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const supportedCountries = [
  'AE', 'AT', 'AU', 'BE', 'BG', 'BR', 'CA', 'CH', 'CI', 'CR',
  'CY', 'CZ', 'DE', 'DK', 'DO', 'EE', 'ES', 'FI', 'FR', 'GB',
  'GI', 'GR', 'GT', 'HK', 'HR', 'HU', 'ID', 'IE', 'IN', 'IT',
  'JP', 'LI', 'LT', 'LU', 'LV', 'MT', 'MX', 'MY', 'NL', 'NO',
  'NZ', 'PE', 'PH', 'PL', 'PT', 'RO', 'SE', 'SG', 'SI', 'SK',
  'SN', 'TH', 'TT', 'US', 'UY'
];

const StripePayment = () => {
  const [subscriptionType, setSubscriptionType] = useState('standard');
  const [currency, setCurrency] = useState('usd');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [country, setCountry] = useState('US');
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const userCountry = response.data.country_code;

        // Check if the country is supported
        if (supportedCountries.includes(userCountry)) {
          setCountry(userCountry);
        } else {
          console.warn(`Country ${userCountry} is not supported. Defaulting to 'US'.`);
          setCountry('US'); // Fallback to US if unsupported
        }
      } catch (error) {
        console.error('Error fetching country:', error);
      }
    };

    fetchCountry();
  }, []);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: country, // Use the detected or default country
        currency: currency,
        total: {
          label: 'Subscription',
          amount: subscriptionType === 'standard' ? 1200 : 2200,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      // Handle the payment request event
      pr.on('token', async (token, event) => {
        if (!event) {
          console.error('Event is undefined.');
          return;
        }

        try {
          // Confirm the payment using the token
          const { data } = await axios.post(
            'http://localhost:3000/api/payments/subscribe',
            {
              token: token.id,
              subscriptionType,
              currency,
            }
          );

          setClientSecret(data.clientSecret);
          event.complete('success'); // Call complete with success
          alert('Payment successful!');
        } catch (error) {
          console.error('Error processing payment:', error);
          event.complete('fail'); // Call complete with failure
          alert('Payment failed, please try again.');
        }
      });
    }
  }, [stripe, subscriptionType, currency, country]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Step 1: Create Subscription Payment Intent
      const { data } = await axios.post(
        'http://localhost:3000/api/payments/subscribe',
        {
          subscriptionType,
          currency,
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2Vzc2lvbklkIjo1LCJpYXQiOjE3MjI2NzU1MDgsImV4cCI6MTcyMjc2MTkwOH0.XufSJ-4eKy-oVPZKB3af80LroQj2iRs9n-vQzyTg2Zc`,
          },
        }
      );

      setClientSecret(data.clientSecret);

      // Step 2: Confirm Card Payment
      const cardElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Goodnews Vncent',
            },
          },
        }
      );

      if (error) {
        console.error('Payment failed:', error);
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        const verificationResponse = await axios.post(
          'http://localhost:3000/api/payments/verify/subscription',
          {
            intentId: paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2Vzc2lvbklkIjo1LCJpYXQiOjE3MjI2NzU1MDgsImV4cCI6MTcyMjc2MTkwOH0.XufSJ-4eKy-oVPZKB3af80LroQj2iRs9n-vQzyTg2Zc`,
            },
          }
        );
        if (verificationResponse.data.valid) {
          alert('Payment and subscription successful!');
        } else {
          alert('Subscription verification failed.');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div>
      <h2>Stripe Payment</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Subscription Type:
          <select value={subscriptionType} onChange={(e) => setSubscriptionType(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label>
          Currency:
          <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </label>
        <label>
          Card Number:
          <CardNumberElement options={ELEMENT_OPTIONS} />
        </label>
        <label>
          Expiration Date:
          <CardExpiryElement options={ELEMENT_OPTIONS} />
        </label>
        <label>
          CVC:
          <CardCvcElement options={ELEMENT_OPTIONS} />
        </label>
        <button type="submit" disabled={!stripe || !elements}>
          Pay with Card
        </button>
      </form>

      {paymentRequest && (
        <div>
          <h3>Alternative Payment Methods</h3>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}
    </div>
  );
};

export default function WrappedStripePayment() {
  return (
    <Elements stripe={stripePromise}>
      <StripePayment />
    </Elements>
  );
}