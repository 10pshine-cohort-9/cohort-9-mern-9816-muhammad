import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
const Banner = () => {
  const [isLogin, setisLogin] = useState(true)
  return (
<section className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-white border-2 border-stone-300  px-4 py-8 sm:px-6 lg:px-8 text-center">

  {/* Decorative Background */}
  <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
  <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl"></div>

  <div className="relative z-10 mx-auto max-w-3xl">
    {/* Badge */}
    <span className="inline-block rounded-full bg-stone-400 px-4 py-2 text-sm font-medium text-emerald-950">
      Organize Your Ideas</span>

    {/* Heading */}
    <h1 className="mt-2 text-4xl font-bold leading-tight text-stone-700 md:text-6xl">
      Capture Every Idea <br /> Before You Forget It</h1>

    {/* Description */}
    <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-stone-800">
      Organize your thoughts, study notes, meeting minutes, and daily ideas in
      one beautiful and secure place. Access your notes whenever you need them.
    </p>
   
    {/* Button */}
    <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
      {isLogin === false ?
    <Link to="/signup"
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-stone-400 text-emerald-950 hover:bg-stone-300 px-7 py-3 font-semibold shadow-lg transition-all duration-300 hover:translate-y-1 hover:shadow-2xl">
        Create Account
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
       :
       <Link to="/all-notes"
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-stone-400 text-emerald-950 hover:bg-stone-300 px-7 py-3 font-semibold shadow-lg transition-all duration-300 hover:translate-y-1 hover:shadow-2xl">
        Explore Notes
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link> 
    }
      
    </div>

  </div>
</section>
  )}
export default Banner
