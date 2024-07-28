import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';
import './signUp.css';

export const Signup = () => {
  const [show, setShow] = React.useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleShowHide = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      alert('Please select an image');
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPic(reader.result);
      setLoading(false);
    };
    reader.readAsDataURL(pics);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill all the required fields');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    let profilePic = pic;
    if (!profilePic) {
      if (gender === 'male') {
        profilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
      } else if (gender === 'female') {
        profilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;
      } else {
        profilePic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      }
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/user',
        { name, email, password, pic: profilePic },
        config
      );
      alert('User created successfully');
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error creating user:' + error.toString());
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="signup-container">
      <CssBaseline />
      <Paper sx={{ borderRadius: "25px" }} elevation={6} className="signup-box">
        <Avatar className="signup-avatar" />
        <Typography component="h1" variant="h5" className="signup-title"
          sx={{ marginBottom: 1, marginTop:1 }}
        >
          Register
        </Typography>
        <Box component="form" noValidate onSubmit={submitHandler} className="signup-form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
                className="signup-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="signup-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="signup-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="signup-input"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" className="signup-input">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row aria-label="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ marginBottom: 2 }}
                type="file"
                fullWidth
                name="profile image"
                label="Profile Image"
                id="profile-image"
                autoComplete="profile-image"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => postDetails(e.target.files[0])}
                className="signup-input"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="signup-button"
            color='success'
            disabled={loading}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="http://localhost:5173/" variant="body2" className="login-link">
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};
