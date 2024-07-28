import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './login.css';
import { ChatState } from '../../contextApi/ChatProvider';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!email || !password) {
      alert("Please enter your email and password");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/user/login',
        { email, password },
        config
      );
      alert('Logged in successfully');
      const expirationTime = Date.now() + 3 * 60 * 60 * 1000; // 3 hours
      const userDetails = {
        ...data,
        expirationTime
      };
      localStorage.setItem('userInfo', JSON.stringify(userDetails));
      setLoading(false);
      setUser(userDetails);
      navigate('/chats');
    } catch (error) {
      console.log(error.message);
      alert('Wrong credentials');
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Grid container component="main" className="login-container">
      <CssBaseline />
      <Paper sx={{ borderRadius: "25px" }} elevation={6} className="login-box">
        <Avatar className="login-avatar">
          <i id="lock-animation" className="fa-solid fa-lock fa-bounce"></i>
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} className="login-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <Button
            type="submit"
            fullWidth
            margin="normal"
            variant="contained"
            color='success'
            className="login-button"
            disabled={loading}
            sx={{
              marginTop: 3
            }}
          >
            Log in
            <Box className='login-enter-icon'>
              <i className="fa-solid fa-right-to-bracket"></i>
            </Box>
          </Button>
          <Grid container>
            <Grid item>
              <Button onClick={handleRegister} className="register-button"
                sx={{
                  marginTop: 2
                }}
              >
                Don't have an account? Click here to Sign Up!
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};
