import React,{useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
function ProtectedRoute() {
    const {isAuthenticated,isLoading}=useContext(AuthContext)
    if(isLoading){
        return <h2>Checking authentication....</h2>
    }
    if(!isAuthenticated){
      return< Navigate to={'/login'} replace/>
    }
    return <Outlet/>
  
}

export default ProtectedRoute