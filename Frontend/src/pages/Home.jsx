import React from 'react'
import Headersection from '../components/header'
import Cards from '../components/Cards'
import Banner from '../components/banner'
import Footer from '../components/footer'
const Home = () => {
  return (
    <div className='bg-stone-50'>
      <Headersection/>
      <Cards/>
      <Banner/>
    </div>
  )
}

export default Home
