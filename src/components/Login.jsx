import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
const AUTH_URL = '/auth';

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const usernameRef = useRef();
  const errorRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        AUTH_URL,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 3000,
        },
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ username, password, roles, accessToken });
      setUsername('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setErrorMessage('No response from server');
      } else if (err.response.status === 400) {
        setErrorMessage('Username and password are required');
      } else if (err.response.status === 401) {
        setErrorMessage('Username and password do not match');
      } else {
        setErrorMessage('Login unsuccessful');
      }
      errorRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errorRef}
        className={errorMessage ? 'errmsg' : 'offscreen'}
        aria-live='assertive'
      >
        {errorMessage}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          ref={usernameRef}
          autoComplete='off'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an account?
        <br />
        <span className='line'>
          <Link to='/register'>Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
