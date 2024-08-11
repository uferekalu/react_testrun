/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-undef */
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import GeneralModal from '../modal/GeneralModal'
import signupBg from '../../images/signup.jpg'
import classes from './RegisterModal.module.scss'
import AnimatedInput from '../input/AnimatedInput'
import AnimatedButton from '../button/Button'
import DismissibleAlert from '../alert/AlertComp'
import Spinner from '../spinner/Spinner'

function RegisterModal({
  createRegister,
  setCreateRegister,
  setRegSuccess,
  setSuccessMsg,
  setServerError,
  setIsError
}) {
  const [userData, setUserData] = useState({
    firstname: '',
    surname: '',
    email: '',
    phone: '',
    kit: '',
    address: '',
    city: '',
    state: '',
    country: '',
    medium: '',
  })
  const [errorMsg, setErrorMsg] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target

    // Update the userData state
    setUserData({ ...userData, [name]: value })

    if (value.length > 1) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }))
    }
  }

  const handleRegister = async () => {
    const newErrors = {}

    if (userData.firstname.trim() === '') {
      newErrors.firstname = 'First name cannot be empty'
    }
    if (userData.surname.trim() === '') {
      newErrors.surname = 'Surname cannot be empty'
    }
    if (userData.email.trim() === '') {
      newErrors.email = 'Email cannot be empty'
    }
    if (userData.phone.trim() === '') {
      newErrors.phone = 'Phone cannot be empty'
    }
    if (userData.kit.trim() === '') {
      newErrors.kit = 'Kit cannot be empty'
    }
    if (userData.address.trim() === '') {
      newErrors.address = 'Address cannot be empty'
    }
    if (userData.city.trim() === '') {
      newErrors.city = 'City cannot be empty'
    }
    if (userData.state.trim() === '') {
      newErrors.state = 'State cannot be empty'
    }
    if (userData.country.trim() === '') {
      newErrors.country = 'Country cannot be empty'
    }
    if (userData.medium.trim() === '') {
      newErrors.medium = 'Medium cannot be empty'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorMsg(newErrors)
    } else {
      try {
        setLoading(true)
        const response = await fetch('https://discipleship.onrender.com/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        if (!response.ok) {
          const errorMessage = await response.json()
          if (response.status === 400) {
            setLoading(false)
            setIsError(true)
            setServerError(errorMessage.error)
            setCreateRegister(false)
          }
          return
        }
        const data = await response.json()
        if (data.message) {
          setLoading(false)
          setRegSuccess(true)
          setSuccessMsg(data.message)
          setCreateRegister(false)
          // setTimeout(() => {
          //   setCreateRegister(false)
          //   window.location.reload()
          // }, 3000)
        }
        setUserData({
          firstname: '',
          surname: '',
          email: '',
          phone: '',
          kit: '',
          address: '',
          city: '',
          state: '',
          country: '',
          medium: '',
        })
      } catch (error) {
        setErrorMsg(error.message)
      }
    }
  }

  return (
    <GeneralModal
      size="lg"
      show={createRegister}
      onHide={() => {
        setCreateRegister(false)
        window.location.reload()
      }}
      className={classes.create__register}
      style={{ backgroundImage: `url(${signupBg})` }}
      style1={{
        marginTop: '5vh',
      }}
    >
      <Modal.Body className={classes.register__form}>
        <motion.form className={classes.register__form}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.register__form__header__container}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.register__form__header__container__text}
            >
              Register for August 2024 Diet
            </motion.div>
          </motion.div>
          <AnimatedInput
            type="text"
            placeholder="First name"
            name="firstname"
            value={userData.firstname}
            onChange={handleInputChange}
            className={`${classes.register__form__firstname} ${errorMsg.firstname && classes.register__form__errorBorder}`}
          />
          {errorMsg.firstname && (
            <span className={classes.error}>{errorMsg.firstname}</span>
          )}
          <AnimatedInput
            type="text"
            placeholder="Surname"
            name="surname"
            value={userData.surname}
            onChange={handleInputChange}
            className={`${classes.register__form__surname} ${errorMsg.surname && classes.register__form__errorBorder}`}
          />
          {errorMsg.surname && (
            <span className={classes.error}>{errorMsg.surname}</span>
          )}
          <AnimatedInput
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className={`${classes.register__form__email} ${errorMsg.email && classes.register__form__errorBorder}`}
          />
          {errorMsg.email && (
            <span className={classes.error}>{errorMsg.email}</span>
          )}
          <AnimatedInput
            type="text"
            placeholder="Phone"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            className={`${classes.register__form__phone} ${errorMsg.phone && classes.register__form__errorBorder}`}
          />
          {errorMsg.phone && (
            <span className={classes.error}>{errorMsg.phone}</span>
          )}
          <motion.select
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            // className={classes.register__form__select}
            className={`${classes.register__form__select} ${errorMsg.kit && classes.register__form__errorBorder}`}
            onChange={handleInputChange}
            value={userData.kit}
            name="kit"
          >
            <option value="">Select kit</option>
            <option value="Survival Kit 1">Survival Kit 1</option>
            <option value="Survival Kit 2">Survival Kit 2</option>
            <option value="Arrival Kit">Arrival Kit</option>
          </motion.select>
          {errorMsg.kit && (
            <span className={classes.error}>{errorMsg.kit}</span>
          )}
          <motion.select
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            // className={classes.register__form__select__medium}
            className={`${classes.register__form__medium} ${errorMsg.medium && classes.register__form__errorBorder}`}
            onChange={handleInputChange}
            value={userData.medium}
            name="medium"
          >
            <option value="">Select means of doing the program</option>
            <option value="online">Online</option>
            <option value="Physical (PCN Ikota Church)">
              {'Physical (PCN Ikota Church)'}
            </option>
          </motion.select>
          {errorMsg.medium && (
            <span className={classes.error}>{errorMsg.medium}</span>
          )}
          <AnimatedInput
            type="text"
            placeholder="Address"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            // className={classes.register__form__address}
            className={`${classes.register__form__address} ${errorMsg.address && classes.register__form__errorBorder}`}
          />
          {errorMsg.address && (
            <span className={classes.error}>{errorMsg.address}</span>
          )}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.register__form__citystate__holder}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.register__form__cityHolder}
            >
              <AnimatedInput
                type="text"
                placeholder="City"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                // className={classes.register__form__citystate__holder__city}
                className={`${classes.register__form__citystate__holder__city} ${errorMsg.city && classes.register__form__errorBorder}`}
              />
              {errorMsg.city && (
                <span className={classes.error__city}>{errorMsg.city}</span>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.register__form__stateHolder}
            >
              <AnimatedInput
                type="text"
                placeholder="State"
                name="state"
                value={userData.state}
                onChange={handleInputChange}
                // className={classes.register__form__citystate__holder__state}
                className={`${classes.register__form__citystate__holder__state} ${errorMsg.state && classes.register__form__errorBorder}`}
              />
              {errorMsg.state && (
                <span className={classes.error__state}>{errorMsg.state}</span>
              )}
            </motion.div>
          </motion.div>
          <AnimatedInput
            type="text"
            placeholder="Country"
            name="country"
            value={userData.country}
            onChange={handleInputChange}
            // className={classes.register__form__country}
            className={`${classes.register__form__country} ${errorMsg.state && classes.register__form__errorBorder}`}
          />
          {errorMsg.country && (
            <span className={classes.error}>{errorMsg.country}</span>
          )}
          {loading && (
            <motion.button
              // whileHover={{ scale: 1.05 }}
              // whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.register__form__spinner}
              type={"button"}
              disabled
            >
              <Spinner />
            </motion.button>
          )}
          {!loading && (
            <AnimatedButton
              text="Submit"
              type="button"
              onClick={handleRegister}
              className={classes.register__form__registerBtn}
            />
          )}
        </motion.form>
      </Modal.Body>
    </GeneralModal>
  )
}

RegisterModal.propTypes = {
  createRegister: PropTypes.bool.isRequired,
  setCreateRegister: PropTypes.func.isRequired,
  setRegSuccess: PropTypes.func,
  setServerError: PropTypes.func,
  setIsError: PropTypes.func,
  setSuccessMsg: PropTypes.func,
}

export default RegisterModal
