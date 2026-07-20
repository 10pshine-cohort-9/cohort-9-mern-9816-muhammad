import React, { useState } from 'react'
import { assets } from '../assets/assets'
const Headersection = () => {
const [isLogin, setisLogin] = useState(true)  
  return (
<section className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10 mx-auto mt-6 max-w-7xl py-10 md:py-16 overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-stone-400 sm:border-2 shadow-lg sm:shadow-xl shadow-stone-500 px-6 text-stone-800 sm:mt-8 sm:px-10 lg:px-14 lg:pt-14">
  {/* left side */}
  <div className="flex flex-col items-center text-center lg:items-start lg:text-left pb-2 lg:pb-14">
    <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
      Let's file your scattered ideas into{" "}
      <span className="text-emerald-700">NOTESBOOK</span>
    </h1>
    {isLogin === false ?
      <a
    href="/signup"
    className="inline-flex w-full sm:w-auto items-center justify-center mt-4 gap-2 rounded-full bg-stone-400 text-emerald-950 px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:translate-y-0.5 hover:bg-stone-300 hover:shadow-xl"
    >
      Create Account <span aria-hidden="true">→</span>
    </a>  
    :
    <a
    href="/new-note"
    className="inline-flex w-full sm:w-auto items-center justify-center mt-4 gap-2 rounded-full bg-stone-400 text-emerald-950 px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:translate-y-0.5 hover:bg-stone-300 hover:shadow-xl"
    >
      Create note now <span aria-hidden="true">→</span>
    </a>
    }
  </div>

  {/*right side*/}
  <div className="relative flex justify-center self-end lg:justify-end w-full md:w-1/2 items-center mt-10 md:mt-0">
    <div className="absolute h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 rounded-full bg-emerald-200/40 blur-2xl sm:blur-3xl bottom-14"></div>
    <img
      src={assets.notePadpicture}
      alt="Start typing"
      className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto max-h-72 sm:max-h-96 md:max-h-[420px] lg:max-h-[520px] xl:max-h-[600px] rounded object-contain mx-auto"
    />
  </div>
</section>
  )
}

export default Headersection
