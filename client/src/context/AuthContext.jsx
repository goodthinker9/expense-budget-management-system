import React,{useState,createContext,useEffect} from 'react'
import axios from 'axios'
const AuthContext = createContext()
export function AuthContextProvider({children}) {
  const [user,setUser]=useState(null)
  const [isAuthenticated,setIsAuthenticated]=useState(false)
  const [isLoading,setIsLoading]=useState(true)
  useEffect(()=>{
    const token=localStorage.getItem('token')
    // const userData=localStorage.getItem('user')
    const userData=async()=>{
      try {
        const response = await axios.get('http://localhost:4000/api/auth/me');
        // console.log(response.data.data)
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      }finally {
        setIsLoading(false);
      }
    }
    userData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
