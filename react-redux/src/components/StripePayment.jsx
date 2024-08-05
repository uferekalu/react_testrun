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
  AddressElement,
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
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('')
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    country: '',
    address: '',
    address_line2: ''
  });
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const userCountry = response.data.country_code;

        if (supportedCountries.includes(userCountry)) {
          setCountry(userCountry);
        } else {
          console.warn(`Country ${userCountry} is not supported. Defaulting to 'US'.`);
          setCountry('US');
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
        country: country,
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
  
      pr.on('paymentmethod', async (event) => {
        try {
          const { data } = await axios.post(
            'http://localhost:3000/api/payments/subscribe',
            {
              paymentMethodId: event.paymentMethod.id,
              subscriptionType,
              currency,
            },
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2Vzc2lvbklkIjo3LCJpYXQiOjE3MjI4NDg2NDEsImV4cCI6MTcyMjkzNTA0MX0.uvZV8ygv-iBwyxzmB9AY_2adikRM1d8V3SOHLbyhcyE`,
              },
            }
          );
  
          setClientSecret(data.clientSecret);
  
          event.complete('success');
          alert('Payment successful!');
        } catch (error) {
          console.error('Error processing payment:', error);
          event.complete('fail');
          alert('Payment failed, please try again.');
        }
      });
  
      return () => {
        pr.off('paymentmethod');
      };
    }
  }, [stripe, subscriptionType, currency, country]);

  const handleCardChange = (event) => {
    if (event.complete) {
      const cardNumber = event.element.value;
      const cardBrand = event.brand;

      setCardType(cardBrand);
      setCardNumber(cardNumber)
    }
  };

  const handleBillingDetailsChange = (event) => {
    const { complete, value } = event;
    if (complete) {
      setBillingDetails((prevDetails) => ({
        ...prevDetails,
        name: value.name,
        country: value.country,
        address: value.address,
        address_line2: value.address_line2 || '',
      }));
    }
  };

  const handleExpirationChange = (event) => {
    if (event.complete) {
      setExpirationDate(event.value);
    }
  };

  const handleCvcChange = (event) => {
    if (event.complete) {
      setCvc(event.value);
    }
  };
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/payments/subscribe',
        {
          subscriptionType,
          currency,
          cardNumber,
          cardType,
          nameOnCard: billingDetails.name,
          billingAddress1: billingDetails.address,
          billingAddress2: billingDetails.address_line2,
          cvc,
          cardExpirationDate: expirationDate
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2Vzc2lvbklkIjo3LCJpYXQiOjE3MjI4NDg2NDEsImV4cCI6MTcyMjkzNTA0MX0.uvZV8ygv-iBwyxzmB9AY_2adikRM1d8V3SOHLbyhcyE`,
          },
        }
      );

      setClientSecret(data.clientSecret);

      const cardElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name,
              address: {
                country: billingDetails.country,
                line1: billingDetails.address,
                line2: billingDetails.address_line2,
              },
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
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2Vzc2lvbklkIjo2LCJpYXQiOjE3MjI2OTI4OTMsImV4cCI6MTcyMjc3OTI5M30.iLnFduNcNyhd1QoCRbkyP-2m0MhH-jDcsM3BgkkOnqo`,
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
          Billing Address:
          <AddressElement options={{ mode: 'shipping' }} onChange={handleBillingDetailsChange} />
        </label>
        <label>
          Card Number:
          <CardNumberElement options={ELEMENT_OPTIONS} onChange={handleCardChange} />
        </label>
        <label>
          Expiration Date:
          <CardExpiryElement options={ELEMENT_OPTIONS} onChange={handleExpirationChange} />
        </label>
        <label>
          CVC:
          <CardCvcElement options={ELEMENT_OPTIONS} onChange={handleCvcChange} />
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
