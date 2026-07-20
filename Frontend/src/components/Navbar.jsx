import React, { useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate();
  const [isLogin, setisLogin] = useState(false)
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
      <div className='flex items-center gap-4'>
     <button onClick={()=> navigate("/signup")} className='hidden md:block bg-stone-400 hover:bg-stone-300 text-emerald-950 px-5 py-2 rounded-lg transition duration-300 shadow'>SignUp</button>
    </div>
    : 
      <div className='flex items-center gap-4'>
     <button onClick={()=> navigate("/signup")} className='hidden md:block bg-stone-400 hover:bg-stone-300 text-emerald-950 px-5 py-2 rounded-lg transition duration-300 shadow'>Logout</button>
    </div>  
  }
    
    <button className='md:hidden text-3xl text-gray-300'>
      ☰
    </button>
  </div>
</nav>

  )
}
export default Navbar
