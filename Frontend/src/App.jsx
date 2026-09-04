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
import SecuredRoute from './components/SecuredRoute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className='m-5'>
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/all-notes' element={ <SecuredRoute> <AllNotes/> </SecuredRoute>}/>
        <Route path='/new-note' element={<SecuredRoute> <CreateNote/> </SecuredRoute>}/>
        <Route path='/NoteView/:id' element={<SecuredRoute> <NoteView/> </SecuredRoute>}/>
        <Route path='/user/signup' element={<SignUp/>}/>
        <Route path='/user/login' element={<Login/>} />
        <Route path='/userdata/userprofile' element={<SecuredRoute> <UserProfile/> </SecuredRoute>}/>
        
      </Routes>
      <Footer/>
    </div>

  )
}

export default App
