import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

// Login component handles user authentication (login or sign-up) with Firebase
function Login() {
  // State for form inputs and component logic
  const [email, setEmail] = useState(''); // Stores email input
  const [password, setPassword] = useState(''); // Stores password input
  const [isSignUp, setIsSignUp] = useState(false); // Toggles between login and sign-up mode
  const [error, setError] = useState(null); // Stores validation or Firebase errors
  const navigate = useNavigate(); // For redirecting after successful auth

  // Regex to validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handles form submission for login or sign-up
  const handleAuth = async () => {
    // Clear any previous errors
    setError(null);

    // Validate form inputs
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length <= 6) {
      setError('Password must be more than 6 characters');
      return;
    }

    try {
      // Perform Firebase authentication based on mode (sign-up or login)
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect to home page on success
      navigate('/');
    } catch (err) {
      // Map Firebase error codes to user-friendly messages
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('No account exists with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/email-already-in-use':
          setError('This email is already registered');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError('An error occurred. Please try again.');
          break;
      }
    }
  };

  // Disable submit button if form is invalid
  const isFormValid = email.trim() && isValidEmail(email) && password.trim() && password.length > 6;

  return (
    // Container for the login/sign-up form, centered with max width
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {/* Heading: "Login" or "Sign Up", centered on mobile, left-aligned on desktop */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
      >
        {isSignUp ? 'Sign Up' : 'Login'}
      </Typography>

      {/* Display error message if validation or Firebase fails */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Email input field */}
      <TextField
        fullWidth
        label="Email"
        type="email" // Enforces email input format
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required // Browser-native validation
      />

      {/* Password input field */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required // Browser-native validation
      />

      {/* Submit button: Login or Sign Up, disabled if form is invalid */}
      <Button
        variant="contained"
        onClick={handleAuth}
        sx={{ mt: 2 }}
        disabled={!isFormValid}
      >
        {isSignUp ? 'Sign Up' : 'Login'}
      </Button>

      {/* Toggle button to switch between Login and Sign Up */}
      <Button
        onClick={() => setIsSignUp(!isSignUp)}
        sx={{ mt: 2, ml: 2 }}
      >
        {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
      </Button>
    </Box>
  );
}

export default Login;