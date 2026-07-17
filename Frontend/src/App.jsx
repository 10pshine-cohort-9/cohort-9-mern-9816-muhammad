import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CreateNote from './pages/CreateNote'
import AllNotes from './pages/AllNotes'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <div className='m-5'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/all-notes' element={<AllNotes/>}/>
        <Route path='/new-note' element={<CreateNote/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </div>

  )
}

export default App
