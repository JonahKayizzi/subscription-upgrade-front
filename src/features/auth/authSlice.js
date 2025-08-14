import { createSlice } from '@reduxjs/toolkit';
import { checkSessionTimeout, setTokenTimestamp, clearTokenTimestamp } from '../../utils/sessionUtils';

// Get initial state from localStorage if available
const getInitialState = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  
  // Check if token is expired
  if (token && checkSessionTimeout(token)) {
    // Clear expired session
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('tokenTimestamp');
    return {
      token: null,
      user: null,
    };
  }
  
  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      
      // Persist to localStorage
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user || null));
      setTokenTimestamp();
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      clearTokenTimestamp();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 