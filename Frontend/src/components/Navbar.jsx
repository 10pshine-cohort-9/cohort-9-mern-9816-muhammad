import React from 'react'
import {Navigate, NavLink, useNavigate} from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate();
  return (
    // <div className='flex items-center justify-between'>
    //   <NavLink to='/' className='font-medium'>NotesBook<hr /></NavLink>
    //   <ul className='hidden md:flex items-start gap-5 font-medium'>
    //   <NavLink to='/'><li>Home</li><hr className='border-none outline-none h-0.5 w-3/2 m-auto bg-slate-700' /></NavLink>
    //   <NavLink to='/'><li>All Notes</li><hr className='border-none outline-none h-0.5 w-3/2 m-auto bg-slate-700'/></NavLink>
    //   <NavLink to='/'><li>Create a new note</li><hr className='border-none outline-none h-0.5 w-3/2 m-auto bg-slate-700'/></NavLink>
    //   </ul>
    //   <div>
    //     <button className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-200 transition hover:bg-cyan-700 hover:shadow-lg cursor-pointer">Sign Up</button>
    //   </div>
    // </div>
//    <nav className="bg-white border-b border-gray-200 shadow-sm">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="flex items-center justify-between h-16">

//       {/* Logo */}
//       <div className="flex items-center gap-2">
//         <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
//           N
//         </div>

//         <div>
//           <h1 className="text-xl font-bold text-gray-800">
//             NotesApp
//           </h1>
//           <p className="text-xs text-gray-500">
//             Keep your ideas organized
//           </p>
//         </div>
//       </div>

      

//       {/* Right Section */}
//       <div className="flex items-center gap-4">

//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
//           + New Note
//         </button>

//         <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
//           T
//         </button>

//       </div>

//     </div>
//   </div>
// </nav>
<nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

    {/* Logo */}
    <NavLink
      to="/"
      className="text-2xl font-bold text-cyan-600 tracking-wide"
    >
      NotesBook
    </NavLink>

    {/* Navigation Links */}
    <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">

      <NavLink
        to="/"
        className="hover:text-cyan-600 transition duration-200"
      >
        <li>Home</li>
      </NavLink>

      <NavLink
        to="/all-notes"
        className="hover:text-cyan-600 transition duration-200"
      >
        <li>All Notes</li>
      </NavLink>

      <NavLink
        to="/new-note"
        className="hover:text-cyan-600 transition duration-200"
      >
        <li>Create Note</li>
      </NavLink>

    </ul>

    {/* Right Section */}
    <div className="flex items-center gap-4">

      <button onClick={()=> navigate("/signup")} className="hidden md:block bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow">
        Sign Up
      </button>

      {/* Mobile Menu Icon */}
      <button className="md:hidden text-3xl text-gray-700">
        ☰
      </button>

    </div>

  </div>
</nav>
  )
}
export default Navbar
