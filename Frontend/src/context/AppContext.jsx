import React from 'react'
import { dummyNotes } from '../assets/assets'
import { createContext } from 'react'
import { RouterContextProvider } from 'react-router-dom'
 

export const AppContext = createContext();
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL

const AppContextProvider = (props) => {
    const value ={
        BACKEND_URL
    }
  
    return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider> 
  )
}

export default AppContextProvider
