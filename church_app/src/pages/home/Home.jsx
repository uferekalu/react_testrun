/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import classes from './Home.module.scss'
import Church from '../../components/church'
import defaultImg from '../../images/main_logo.png'
import Text from '../../components/text/Text'
import AnimatedButton from '../../components/button/Button'
import cross from '../../images/cross.jpg'
import RegisterModal from '../../components/register/RegisterModal'
import SuccessModal from '../../components/success/SuccessModal'

const relevanceData = [
  {
    icon: 'bi bi-book-half',
    title: 'Survival Kit 1',
    description: `Welcome to the beginning of the discipleship program. Being a Christian is far 
      more than trusting God for salvation. You probably 
      have discovered, the harder you try the more difficult 
      it is to grow spiritually and live out your professed faith.
      You can win!! Survival is a promised certainty for you, if you desire it.
      The survival kit 1 shares five keys to effective spiritual growth. These 
      truths will help you mature spiritually, in the years to come.`,
  },
  {
    icon: 'bi bi-book-half',
    title: 'Survival Kit 2',
    description: `This is for those who have completed KIT 1 and are actively serving 
    in various capacities in ministering to the church. Just as there are growth stages in 
    life, there are also Christian growth stages.
    We are constantly faced with the challenge of identity, the meaning and effect of our identity to our world.
    You are a minister, a servant of God!!! Survival kit 2 helps us review and reshape our values, understand our calling, 
    and learn to serve God and shine forth God’s light in our various vocations.`,
  },
  {
    icon: 'bi bi-book-half',
    title: 'Arrival Kit',
    description: `This is the third step on the discipleship course ladder. This course is 
    meant for those who have completed the survival kit 2. It aims to help the servant minister live, 
    as well as actively spur other believers to embrace a new lifestyle on arriving into the Lord’s kingdom.
    It delves into kingdom lifestyles, dealing with strongholds and attitudes and the journey beyond.`,
  },
]

function Home() {
  const [createRegister, setCreateRegister] = useState(false)
  const [createSuccessModal, setCreateSuccessModal] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [serverError, setServerError] = useState('')
  const [isError, setIsError] = useState(false)

  console.log("successmesag", successMsg)

  const handleCreateRegister = () => {
    setCreateRegister(true)
  }

  useEffect(() => {
    if (regSuccess) {
      setCreateSuccessModal(true)
    }
  }, [regSuccess])

  useEffect(() => {
    if (serverError) {
      setCreateSuccessModal(true)
    }
  }, [serverError])

  return (
    <>
      <Church
        title="Discipleship School"
        description="This is Discipleship School."
        url="/"
        image={defaultImg}
      />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={classes.home}
      >
        <motion.div
          style={{
            backgroundImage: `url(${cross})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={classes.home__heroSection}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.home__heroSection__left}
          >
            <Text
              text="WELCOME TO DISCIPLESHIP SCHOOL"
              className={classes.home__heroSection__left__caption}
            />
            <Text
              text="Join our February 2024 diet"
              className={classes.home__heroSection__left__description}
            />
            <AnimatedButton
              text="Register here"
              onClick={handleCreateRegister}
              className={classes.home__heroSection__left__learnmore}
              type="button"
            />
          </motion.div>
        </motion.div>
        <Text
          text={`...Then Jesus came to them and said, all authority in heaven and on Earth has been given to me.
							Therefore go and make disciples of all nations baptizing them in the name of the father and the son and the
							Holy Spirit and teaching them to obey everything I have commanded you and surely 
							I am with you always to the very end of the age.`}
          className={classes.home__welcome__description}
        />
        <Text
          text={` -- Matthew 28:18-20`}
          className={classes.home__welcome__description__verse}
        />
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={classes.home__about__heading}
        >
          Our Discipleship Classes
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={classes.home__relevance}
        >
          {relevanceData.map((data, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.home__relevance__content}
              // eslint-disable-next-line react/no-array-index-key
              key={`${data.name}-${idx}`}
            >
              <motion.i
                transition={{ duration: 0.5 }}
                style={{
                  color: 'pink',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '30px',
                }}
                className={data.icon}
              />
              <Text
                text={data.title}
                className={classes.home__relevance__content__about}
              />
              <Text
                text={data.description}
                className={classes.home__relevance__content__description}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={classes.home__contact}
          id="contactUs"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.home__contact__title}
          >
            Contact Us:
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.home__contact__addressholder}
          >
            <motion.i
              transition={{ duration: 0.5 }}
              style={{
                color: 'black',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              className="bi bi-compass"
            />
            <Text
              text="KM 22, Ikota Lekki-Epe Expressway, Lagos, Nigeria"
              className={classes.home__contact__addressholder__addressText}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.home__contact__phoneHolder}
          >
            <motion.i
              transition={{ duration: 0.5 }}
              style={{
                color: 'Black',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              className="bi bi-telephone-fill"
            />
            <Text
              text="0803 622 9322"
              className={classes.home__contact__phoneHolder__phoneNumber}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.home__contact__emailHolder}
          >
            <motion.i
              transition={{ duration: 0.5 }}
              style={{
                color: 'Black',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              className="bi bi-telephone-fill"
            />
            <Text
              text="pcnlekki@yahoo.com"
              className={classes.home__contact__emailHolder__emailText}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.home__contact__websiteHolder}
          >
            <motion.i
              transition={{ duration: 0.5 }}
              style={{
                color: 'Black',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              className="bi bi-globe"
            />
            <Text
              text="pcnlekki.org"
              className={classes.home__contact__websiteHolder__url}
            />
          </motion.div>
        </motion.div>

        <RegisterModal
          createRegister={createRegister}
          setCreateRegister={setCreateRegister}
          setRegSuccess={setRegSuccess}
          setSuccessMsg={setSuccessMsg}
          setServerError={setServerError}
          setIsError={setIsError}
        />
        <SuccessModal
          createSuccessModal={createSuccessModal}
          setCreateSuccessModal={setCreateSuccessModal}
          successMsg={
            serverError
              ? `${serverError}`
              : successMsg
                ? `${successMsg}`
                : ""
          }
          isError={isError}
        />
      </motion.div>
    </>
  )
}

export default Home
