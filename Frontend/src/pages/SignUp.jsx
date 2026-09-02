import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { showError, showSuccess, showWarning } from '../utils/reactToastify';

const SignUp = () => {
  const {BACKEND_URL} = useContext(AppContext)

  const [UserName, setUserName]= useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false)
  const navigate = useNavigate();

  const emailRegExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  const registerUser = async (event) => {
    event.preventDefault();
     if (UserName === "") {
        showWarning("UserName is required")
        return;
      }
      if (!Email.trim()) {
        showWarning('Email is required')
        return;
      }
      if (!emailRegExpression.test(Email)) {
        showWarning("Please enter a valid Email")
        return;
      }
      if (!Password) {
        showWarning("Enter password")
        return;
      }
      if (!passwordRegExpression.test(Password)) {
        showWarning("Password must be at least 8 characters and contain uppercase, lowercase and a number")
        return;
      }
    try {
   const response = await axios.post(BACKEND_URL + '/user/signup', {UserName, Email, Password});
  
   if (response.data.success) {
      showSuccess("You Are Registered successfully")
      setUserName('');
      setEmail('');
      setPassword('');
      navigate('/user/login')
    } else{
      showError(response.data.message || "SIGNUP failed")
    }
    
   console.log(response);
      
    } catch (error) {
      showError(error.response?.data?.message || "SignUp Failed")
      console.log(error.response?.Data?.message || "SignUp Failed");
      
    }
  }


  return (
    <section className='flex min-h-[calc(100vh-160px)] items-center justify-center bg-gradient-to-b from-stone-50/70 to-white px-4 py-10 sm:px-6'>
      <form autoComplete='on' onSubmit={(event) => registerUser(event)}
      className='w-full max-w-md rounded-3xl border border-stone-500 bg-stone-100 p-6 shadow-xl shadow-stone-100/50 sm:p-8'>
       <div className='text-center'>
          <span className='inline-flex rounded-full bg-stone-50 px-4 py-2 text-sm font-semibold text-emerald-800'>NOTESBOOK Account</span>
        <h1 className='mt-4 text-2xl font-bold tracking-tight text-emerald-900 sm:text-3xl'>
          Create Account</h1>
        <p className='mt-2 text-sm leading-6 text-emerald-600'>
          Please Create an Account to access NOTESBOOK</p>
       </div>

      <div className='mt-7 space-y-4'>
      {/*For Name*/}  
          <div>
            <label htmlFor="name" className='mb-2 block text-sm font-semibold text-emerald-800'>
            Full Name:</label>
            <input type="text" id="name" autoComplete='name' placeholder='Enter Your Full Name'
            required value={UserName} onChange={(event) => setUserName(event.target.value)} 
            className='w-full rounded-xl border border-stone-300 bg-stone-100/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-500 focus:border-stone-500 focus:bg-white focus:ring-4 focus:ring-stone-200' />
          </div>


        {/*For Email*/}
       <div>
        <label htmlFor="mail" className='mb-2 block text-sm font-semibold text-emerald-800'>
          Email Address</label>
        <input type="email" id="mail" autoComplete='email' placeholder='you@example.com'
        required value={Email} onChange={(event) => setEmail(event.target.value)}
        className='w-full rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-500 focus:border-stone-500 focus:bg-white focus:ring-4 focus:ring-stone-200' />
      </div> 
        
        {/*For Password*/}
        <div>
          <label htmlFor="Password" className='mb-2 block text-sm font-semibold text-emerald-800'>
            Password</label>

          <div className='relative'>
          <input type={showPassword ? "text" : "password"} id="Password" autoComplete='new-password' placeholder='Enter your password'
          required value={Password} onChange={(event) => setPassword(event.target.value)}
          className='w-full rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-500 focus:border-stone-500 focus:bg-white focus:ring-4 focus:ring-stone-200' />
        
          <button type='button' onClick={ () => setshowPassword((prev) => !prev)} 
           className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-emerald-700" aria-label={showPassword ? "Hide password" : "Show password"}>
           {showPassword ? <assets.EyeOff size={20}/> : <assets.Eye size={20}/> }
           </button>
          </div>  
        </div>
       </div>

        <button type="submit"
        className='mt-7 w-full rounded-xl bg-stone-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-stone-100 transition hover:bg-stone-600 focus:outline-none focus:ring-4 focus:ring-stone-200'>
          Create Account</button> 
        
        <p className='mt-6 text-center text-sm text-emerald-600'>
          
          <>
            Already have an Account?{" "}
            <button type="button" onClick={()=> navigate("/user/login")}
             className='font-semibold text-emerald-700 transition hover:text-emerald-900' >
              Login here
            </button>
          </>
        
        </p>
      </form>
    </section>
    
  )
}

export default SignUp
