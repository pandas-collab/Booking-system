import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Link, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Mock user credentials
const MOCK_USERS = [
  { id: 1, email: "john.doe@email.com", password: "password123", fullName: "John Doe", registrationDate: "2024-01-01" },
  { id: 2, email: "sarah.chen@email.com", password: "travel2024", fullName: "Sarah Chen", registrationDate: "2024-01-02" },
  { id: 3, email: "admin@travelapp.com", password: "admin123", fullName: "Admin User", registrationDate: "2024-01-03" }
];

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate against mock users
    const user = MOCK_USERS.find(u =>
      u.email === formData.email && u.password === formData.password
    );

    if (user) {
      setSuccess('Login successful! Redirecting...');
      login(user);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            TravelApp
          </Typography>
          <Typography variant="h5" component="h2" color="primary">
            Sign In
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </form>

        <Box sx={{ textAlign: 'center' }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/forgot-password')}
            sx={{ display: 'block', mb: 1 }}
          >
            Forgot Password?
          </Link>

          <Typography variant="body2">
            Don't have an account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/register')}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
