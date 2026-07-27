import React, { useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import { assets, userProfile } from '../assets/assets';
const Navbar = () => {
  const navigate = useNavigate();
  const [isLogin, setisLogin] = useState(true)
  return (
<nav className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
  <div className='max-w-7xl mx-auto px-6 h-14 flex items-center justify-between'>
    <NavLink to="/" className="text-2xl font-bold text-emerald-950 tracking-wide">NOTESBOOK</NavLink>
    
    <ul className='hidden md:flex items-center gap-8 text-emerald-950 font-medium'>
      <NavLink to="/" className="text-emerald-950 hover:text-emerald-900 transition duration-200"><li>HOME</li></NavLink>
      <NavLink to="/all-notes" className="text-emerald-950 hover:text-emerald-900 transition duration-200"><li>ALL-NOTES</li></NavLink>
      <NavLink to="/new-note" className="text-emerald-950 hover:text-emerald-900 transition duration-200"><li>NEW-NOTE</li></NavLink>
    </ul>
    {isLogin === false ?
      (<div className='flex items-center gap-4'>
     <button onClick={()=> navigate("/signup")} className='hidden md:block bg-stone-400 hover:bg-stone-300 text-emerald-950 px-5 py-2 rounded-lg transition duration-300 shadow'>SignUp</button>
    </div>)
    : (
    <div className='group relative flex items-center gap-2 cursor-pointer'>
      <img src={userProfile.image} alt="your_image" className='w-10 h-10 rounded-full ring-2 ring-transparent transition group-hover:ring-emerald-200'/> 
      <assets.ChevronDown className='w-4 h-4 text-emerald-950 transition duration-200 group-hover:rotate-100'/>

     <div className='absolute right-0 top-full z-20 hidden pt-3 group-hover:block'>
        <div className='flex min-w-48 flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50 shadow-lg shadow-stone-300/60'>
      <button onClick={()=> navigate('/userprofile')}
      className='px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer'>
        My Profile</button>
          <div className='h-px bg-stone-200'/>
       <button onClick={()=> setisLogin(false)} 
      className='px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-red-50'>Logout</button>
        </div>
     </div>
    </div>
    )}
    
    <button className='md:hidden text-3xl text-gray-300'>
      ☰
    </button>
  </div>
</nav>

  )
}
export default Navbar
