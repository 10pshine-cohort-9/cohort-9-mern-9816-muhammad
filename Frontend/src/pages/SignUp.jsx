import React, { useState } from 'react'

const SignUp = () => {
  const [State, setState] = useState("SignUp");
  const [Name, setName]= useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const formHandler = async (event) => {
      event.preventDefault();
  };

  return (
    <section className='flex min-h-[calc(100vh-160px)] items-center justify-center bg-gradient-to-b from-stone-50/70 to-white px-4 py-10 sm:px-6'>
      <form onSubmit={formHandler}
      className='w-full max-w-md rounded-3xl border border-stone-500 bg-stone-100 p-6 shadow-xl shadow-stone-100/50 sm:p-8'>
       <div className='text-center'>
          <span className='inline-flex rounded-full bg-stone-50 px-4 py-2 text-sm font-semibold text-emerald-800'>NOTESBOOK Account</span>
        <h1 className='mt-4 text-2xl font-bold tracking-tight text-emerald-900 sm:text-3xl'>
          {State === 'SignUp' ? "Create Account" : "Welcome Back"}</h1>
        <p className='mt-2 text-sm leading-6 text-emerald-600'>
          Please {State === 'SignUp' ? "Create an Account" : "Login"} to access NOTESBOOK</p>
       </div>

      <div className='mt-7 space-y-4'>
      {/*For Name*/}
        {State === 'SignUp' && (
          <div>
            <label htmlFor="name" className='mb-2 block text-sm font-semibold text-emerald-800'>
            Full Name:</label>
            <input type="text" id="name" placeholder='Enter Your Full Name'
            required onChange={(event) => setName(event.target.value)} value={Name}
            className='w-full rounded-xl border border-stone-300 bg-stone-100/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-500 focus:border-stone-500 focus:bg-white focus:ring-4 focus:ring-stone-200' />
          </div>
        )}

        {/*For Email*/}
       <div>
        <label htmlFor="mail" className='mb-2 block text-sm font-semibold text-emerald-800'>
          Email Address</label>
        <input type="email" id="mail" placeholder='you@example.com'
        required value={Email} onChange={(event) => setEmail(event.target.value)}
        className='w-full rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-500 focus:border-stone-500 focus:bg-white focus:ring-4 focus:ring-stone-200' />
      </div> 
        
        {/*For Password*/}
        <div>
          <label htmlFor="Password" className='mb-2 block text-sm font-semibold text-emerald-800'>
            Password</label>
          <input type="password" id="Password" placeholder='Enter your password'
          required value={Password} onChange={(event) => setPassword(event.target.value)}
          className='w-full rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-500 focus:border-stone-500 focus:bg-white focus:ring-4 focus:ring-stone-200' />
        </div>
       </div>

        <button type="submit" className='mt-7 w-full rounded-xl bg-stone-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-stone-100 transition hover:bg-stone-600 focus:outline-none focus:ring-4 focus:ring-stone-200'>
          {State === 'SignUp' ? "Create Account" : "Login"}</button> 
        
        <p className='mt-6 text-center text-sm text-emerald-600'>
          {State === 'SignUp' ? (
          <>
            Already have an Account?{" "}
            <button type="button" onClick={()=> setState("Login")}
             className='font-semibold text-emerald-700 transition hover:text-emerald-900' >
              Login here
            </button>
          </>
        ) : (
          <>
           Don&apos;t have an Account?{" "}
           <button type="button" onClick={()=> setState("SignUp")}
            className='font-semibold text-emerald-700 transition hover:text-emerald-900'>
            Create Account
           </button>
          </>
        )}
        </p>
      </form>
    </section>
    
  )
}

export default SignUp
