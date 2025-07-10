import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';

import DashboardImage from '../Assets/Images/Dashboard.png';
import Logo from '../Assets/Images/logo.png';

const StudentHome = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 2 }}>
          <img src={Logo} alt='Logo' height='40' />
        </Box>

        {/* Welcome Text */}
        <Typography variant='h5' fontWeight='bold' gutterBottom>
          Welcome, Student!
        </Typography>
        <Typography variant='body1' color='text.secondary' gutterBottom>
          Access your dashboard, view assignments, track attendance, and more.
        </Typography>

        {/* Dashboard Illustration */}
        <Box sx={{ my: 2 }}>
          <img
            src={DashboardImage}
            alt='Student Dashboard Illustration'
            height='200'
            width='100%'
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Button
            variant='contained'
            component={Link}
            to='/student/login'
            sx={{ backgroundColor: '#1a73e8' }}
          >
            Login as Student
          </Button>

          <Button
            variant='outlined'
            component={Link}
            to='/student/signup'
          >
            New Student? Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentHome;
