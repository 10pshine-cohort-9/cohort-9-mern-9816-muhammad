import React from 'react'
import { CardFeatures } from '../assets/assets'
const Cards = () => {
  return (
    <section className='mt-5 p-5 mb-5 py-6'>
        <h1 className='mb-5 font-serif text-2xl text-stone-900'>Main Features of NOTESBOOK</h1>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
    {CardFeatures.map((item, index,) => (
        <div key={index} className={`transform transition-transform duration-300 ease-out hover:scale-105 hover:[transform:rotateX(2deg)_rotateY(-2deg)] ${item.rotate} rounded-md p-6 bg-white border border-solid border-stone-400 shadow-lg`}>
         <p className='font-label text-xs text-emerald-950 uppercase tracking-wider opacity-6'>{item.id}</p>
         <div className='mt-4 mb-4 h-10 w-10 flex items-center justify-center rounded-sm  bg-gray-400'>
          <item.icon className="h-5 w-5 text-green-950"/>
        </div>
         <h3 className="font-display text-lg font-semibold text-stone-700">{item.title}</h3>
         <p className="mt-2 text-sm leading-relaxed opacity-75 text-stone-800">{item.desc}</p>
        </div>
    ))}
    </div>

    <div></div>
    <div></div>
    <div></div>
    </section>
  )
}

export default Cards
