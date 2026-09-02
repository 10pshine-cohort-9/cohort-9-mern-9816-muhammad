import React from 'react'
import { Navigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { showWarning } from '../utils/reactToastify'
import { AppContext } from '../context/AppContext'
const SecuredRoute = ({children}) => {
 
  const { token } = useContext(AppContext)

  useEffect( () => {
    if (!token) {
        showWarning('Please login first to access this feature')
    }
  }, [token])
    
  if (!token) {
       return <Navigate to='/user/login' replace />
    }

    return children
}

export default SecuredRoute
