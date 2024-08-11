/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classes from './Header.module.scss'
import Text from '../text/Text'
import AnimatedButton from '../button/Button'
import flowerybg from '../../images/flowery.jpg'
import RegisterModal from '../register/RegisterModal'
import SigninModal from '../signin/Signin'
import HeaderLogo from './HeaderLogo'

function Header() {
  const navigate = useNavigate()
  const [menuToggle, setMenuToggle] = useState(false)
  const [createRegister, setCreateRegister] = useState(false)
  const [createSignin, setCreateSignin] = useState(false)
  const currentURL = window.location.href
  const [token, setToken] = useState(null)
  const [usersData, setUsersData] = useState([])
  const [decodedToken, setDecodedToken] = useState(null)

  useEffect(() => {
    try {
      if (token) {
        const [header, payload, signature] = token.split('.')
        const decodedPayload = JSON.parse(atob(payload))
        setDecodedToken(decodedPayload)
      }
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }, [token])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://discipleship.onrender.com/api',
        )
        localStorage.setItem('discipleData', JSON.stringify(response.data))
        const retrievedUserData = JSON.parse(
          localStorage.getItem('discipleData'),
        )
        if (retrievedUserData) {
          setUsersData(retrievedUserData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(usersData)
    XLSX.utils.book_append_sheet(wb, ws, 'Users Data')
    XLSX.writeFile(wb, 'users_data.xlsx')
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const handleCreateRegister = () => {
    setCreateRegister(true)
    setMenuToggle(false)
  }
  const handleCreateSignin = () => {
    setCreateSignin(true)
    setMenuToggle(false)
  }

  const handleMenuToggle = () => {
    setMenuToggle((prevvState) => !prevvState)
  }

  const signout = () => {
    localStorage.removeItem('userToken')
    window.location.reload()
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={classes.header}
    >
      <HeaderLogo />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={classes.header__linksHolder}
      >
        <Text
          text="Home"
          className={classes.header__linksHolder__homeLink}
          onClick={() => navigate('/')}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={classes.header__contactUs__register}
      >
        {currentURL.includes('onyeisi') && (
          <>
            <AnimatedButton
              text={
                decodedToken && decodedToken.isAdmin
                  ? 'Download Users'
                  : 'Signin'
              }
              onClick={
                decodedToken && decodedToken.isAdmin
                  ? exportToExcel
                  : handleCreateSignin
              }
              className={classes.header__contactUs__register__contact}
              type="button"
            />
            {token && (
              <AnimatedButton
                text="Signout"
                onClick={signout}
                className={classes.header__contactUs__register__contact}
                type="button"
              />
            )}
          </>
        )}
        <AnimatedButton
          text="Register"
          onClick={handleCreateRegister}
          className={classes.header__contactUs__register__signup}
          type="button"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={classes.header__mobileMenu}
      >
        {!menuToggle && (
          <motion.i
            onClick={handleMenuToggle}
            transition={{ duration: 0.5 }}
            style={{
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '30px',
              marginTop: '-10px',
            }}
            className="bi bi-list"
          />
        )}
        {menuToggle && (
          <motion.i
            onClick={handleMenuToggle}
            transition={{ duration: 0.5 }}
            style={{
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '30px',
              marginTop: '-10px',
            }}
            className="bi bi-x-square-fill"
          />
        )}
        <motion.div
          style={{ backgroundImage: `url(${flowerybg})` }}
          key={menuToggle}
          initial={{
            opacity: 0,
            scale: 0.2,
            y: '-50%',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }} // Start from the middle
          animate={{
            opacity: 1,
            scale: 1,
            y: '0%',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.4)',
          }} // Grow to cover the screen
          exit={{ opacity: 0, scale: 0.5, y: '-50%' }}
          transition={{ duration: 1.0 }}
          className={`${
            menuToggle
              ? classes.header__mobileMenu__menucontent
              : classes.header__mobileMenu__nomenucontent
          }`}
        >
          <div className={classes.header__mobileMenu__menucontent__container}>
            <Text
              text="Home"
              className={
                classes.header__mobileMenu__menucontent__container__homelink
              }
              onClick={() => {
                navigate('/')
                setMenuToggle(false)
              }}
            />
            {currentURL.includes('onyeisi') && (
              <>
                <AnimatedButton
                  text={
                    decodedToken && decodedToken.isAdmin
                      ? 'Download Users'
                      : 'Signin'
                  }
                  onClick={
                    decodedToken && decodedToken.isAdmin
                      ? exportToExcel
                      : handleCreateSignin
                  }
                  className={
                    classes.header__mobileMenu__menucontent__container__sigin
                  }
                  type="button"
                />
                {token && (
                  <AnimatedButton
                    text="Signout"
                    onClick={signout}
                    className={
                      classes.header__mobileMenu__menucontent__container__sigin
                    }
                    type="button"
                  />
                )}
              </>
            )}

            <AnimatedButton
              text="Register"
              onClick={handleCreateRegister}
              className={
                classes.header__mobileMenu__menucontent__container__signup
              }
              type="button"
            />
          </div>
        </motion.div>
      </motion.div>
      <RegisterModal
        createRegister={createRegister}
        setCreateRegister={setCreateRegister}
      />
      <SigninModal
        createSignin={createSignin}
        setCreateSignin={setCreateSignin}
      />
    </motion.div>
  )
}

export default Header
