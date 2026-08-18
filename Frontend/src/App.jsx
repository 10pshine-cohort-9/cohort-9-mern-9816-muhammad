import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CreateNote from './pages/CreateNote'
import AllNotes from './pages/AllNotes'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Footer from './components/footer'
import NoteView from './pages/NoteView'
import UserProfile from './pages/UserProfile'

const App = () => {
  return (
    <div className='m-5'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/all-notes' element={<AllNotes/>}/>
        <Route path='/new-note' element={<CreateNote/>}/>
        <Route path='/NoteView/:id' element={<NoteView/>}/>
        <Route path='/user/signup' element={<SignUp/>}/>
        <Route path='/user/login' element={<Login/>} />
        <Route path='/userdata/userprofile' element={<UserProfile/>}/>
        
      </Routes>
      <Footer/>
    </div>

  )
}

export default App
