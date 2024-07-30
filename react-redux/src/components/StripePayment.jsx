import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'

const stripePromise = loadStripe(
  'pk_test_51GyLKTD8bKf8QQtz5VPgmCbpvqrXJgAUMNIXkz41l8iqnYymMCPo9ePEDhMiFRcMXpoQzXIjw7F8WKjq7XhYVwtY00skOdOq55',
)

const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
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
}

const StripePayment = () => {
  const [subscriptionType, setSubscriptionType] = useState('free')
  const [currency, setCurrency] = useState('usd')
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
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
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic2Vzc2lvbklkIjoyLCJpYXQiOjE3MjIxNjM3NDAsImV4cCI6MTcyMjI1MDE0MH0._otsJHqd5_M5v3LGOA-VBHePRPhAWw91FPbxfMPjxNk`,
          },
        },
      )

      console.log(data)

      setClientSecret(data.clientSecret)

      // Step 2: Confirm Card Payment
      const cardElement = elements.getElement(CardNumberElement)
      console.log('Card Element:', elements.getElement(CardNumberElement))

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // You can add additional billing details here if needed
              name: 'Goodnews Vncent', // Replace with actual user name
            },
          },
        },
      )

      if (error) {
        console.error('Payment failed:', error)
        alert(`Payment failed: ${error.message}`)
      } else if (paymentIntent.status === 'succeeded') {
        const verificationResponse = await axios.post(
          'http://localhost:3000/api/payments/verify/subscription',
          {
            intentId: paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic2Vzc2lvbklkIjoyLCJpYXQiOjE3MjIxNjM3NDAsImV4cCI6MTcyMjI1MDE0MH0._otsJHqd5_M5v3LGOA-VBHePRPhAWw91FPbxfMPjxNk`,
            },
          },
        )
        if (verificationResponse.data.valid) {
          alert('Payment and subscription successful!')
        } else {
          alert('Subscription verification failed.')
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
    }
  }

  return (
    <div>
      <h2>Stripe Payment</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <label>
          Subscription Type:
          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          >
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label>
          Currency:
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
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
          Pay
        </button>
      </form>
    </div>
  )
}

export default function WrappedStripePayment() {
  return (
    <Elements stripe={stripePromise}>
      <StripePayment />
    </Elements>
  )
}
