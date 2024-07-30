import { Route, Routes,  } from 'react-router-dom'
import './App.css'
import Counter from './features/counter/Counter'
import PostList from './features/posts/PostList'
import WrappedStripePayment from './components/StripePayment'
import PaystackPayment from './components/PaystackPayment'
import PaymentVerification from './components/PaymentVerification'

function App() {
  return (
    <>
      <Routes>
        <Route path='/counter' element={<Counter />} />
        <Route path='/posts' element={<PostList />} />
        <Route path='/payments/stripe' element={<WrappedStripePayment />} />
        <Route path='/payments/paystack' element={<PaystackPayment />} />
        <Route path='/payment-verification' element={<PaymentVerification />} />
      </Routes>
    </>
  )
}

export default App
