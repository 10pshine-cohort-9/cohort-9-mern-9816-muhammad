import React, { useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import { assets, userProfile } from '../assets/assets';
const Navbar = () => {

  const navigate = useNavigate();
  const [isLogin, setisLogin] = useState(true)
  const [mobileMenu, setmobileMenu] = useState(false)
  const [profileMenu, setprofileMenu] = useState(false)

return (
<>    
{/*This is the Desktop or big screens Navbar*/}
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
     <button onClick={()=> navigate("/signup")} className='hidden md:block bg-stone-400 hover:bg-stone-300 text-emerald-950 px-5 py-2 rounded-lg transition duration-300 shadow'>
      SignUp</button>
    </div>)
    : (
    <div className='relative'>
      <button type='button' onClick={() => setprofileMenu(!profileMenu)} aria-haspopup='menu' aria-expanded={profileMenu} 
      className='flex items-center gap-2 cursor-pointer'>
      <img src={userProfile.image} alt="your_image" className='w-10 h-10 rounded-full ring-2 ring-transparent transition '/> 
      <assets.ChevronDown className='w-4 h-4 text-emerald-950 transition duration-200 '/>
      </button>

      {profileMenu && (
      <div className='absolute right-0 top-full z-20 pt-3'>
        <div className='flex min-w-48 flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50 shadow-lg shadow-stone-300/60'>
      <button onClick={()=> {navigate('/userprofile'), setprofileMenu(!profileMenu)}}
      className='px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer'>
        My Profile</button>
          <div className='h-px bg-stone-200'/>
       <button onClick={()=>{ setisLogin(false); navigate("/"); }} 
      className='px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-red-50'>Logout</button>
        </div>
     </div>
    )}
    </div>
    )}
    
    <button className='md:hidden text-3xl text-gray-300'
    onClick={()=> setmobileMenu(true)}>
      ☰
    </button>

  </div>
</nav>

 {/*This is the Mobile or small screens Navbar*/} 
{mobileMenu && (
  <div className='fixed inset-0 z-50 md:hidden'>
    <div className='absolute inset-0 bg-stone-900/40'
    onClick={()=> setmobileMenu(false)}/>

    <div className='absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-xl'>
      <div className='flex h-14 items-center justify-between border-b border-stone-200 px-6'>
        <NavLink to='/' onClick={()=> setmobileMenu(false)}>
          <h1 className='text-xl font-bold text-emerald-950 tracking-wide'>NOTESBOOK</h1>  
        </NavLink>

        <button onClick={()=>setmobileMenu(false)} className='text-2xl text-stone-400 transition hover:text-stone-600'>
          ✕ </button>
      </div>

      <nav className='flex-1 overflow-y-auto px-6 py-6'>
      <ul className='flex flex-col gap-1 font-medium text-emerald-950'>
        <NavLink to="/" onClick={()=> setmobileMenu(false)} className="rounded-lg px-3 py-2.5 transition hover:bg-emerald-50 hover:text-emerald-900">
        <li>HOME</li></NavLink>
        <NavLink to="/all-notes" onClick={()=> setmobileMenu(false)} className="rounded-lg px-3 py-2.5 transition hover:bg-emerald-50 hover:text-emerald-900">
        <li>ALL-NOTES</li></NavLink>
        <NavLink to="/new-note" onClick={()=> setmobileMenu(false)} className="rounded-lg px-3 py-2.5 transition hover:bg-emerald-50 hover:text-emerald-900">
        <li>NEW-NOTE</li></NavLink>
      </ul>
      </nav>     
    
      <div className='border-t border-stone-200 px-6 py-5'>
        {isLogin ? (
          <div>
            <button type="button" onClick={() => setprofileMenu(!profileMenu)}
             className='flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50' >
            <span>My Account</span>
            <assets.ChevronDown className={`h-4 w-4 transition duration-200 ${profileMenu ? "rotate-180" : "" }`}/>
            </button>

            {profileMenu && (
              <div className='mt-1 flex flex-col overflow-hidden rounded-lg border border-stone-200'>
                <button type='button' onClick={() => {
                  navigate("/UserProfile");
                  setmobileMenu(false);
                  setprofileMenu(false);
                }}
                className='px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900'>
                  My Profile</button>

                <div className='h-px bg-stone-200'/>
                  <button type="button" onClick={()=>{
                    setisLogin(false);
                     navigate("/");
                     setmobileMenu(false);
                     setprofileMenu(false);
                     }}
                     className='px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-red-50 hover:text-red-600'>

                    Logout</button>
              </div>
            )}
          </div>
        )
        : 
        <button type="button" onClick={() => { navigate("/SignUp"); setmobileMenu(false); }}
        className='w-full rounded-lg bg-stone-400 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow transition hover:bg-stone-300'>
          SignUp</button>
      }
                
      </div>  
      </div>
  </div>
  )}
</> 
  )
}
export default Navbar
