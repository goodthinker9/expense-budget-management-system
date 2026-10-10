import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService.js';
import  AuthContext  from '../context/AuthContext.jsx';
function Login() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isloading,setLoading]=useState(false)
  const [error,setError]=useState(null)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response=await login({ email, password });
      // Handle successful login (e.g., redirect to dashboard)
      console.log(response.data.user)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
      navigate('/dashboard'); // Replace with your desired route
    } catch (error) {
      // Handle login error
      const message = error.response.data.message;
      setError(message);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isloading}>
          {isloading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login