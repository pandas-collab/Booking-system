import React from 'react';
import { Card, CardContent, Box, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from '../components/LoginForm';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const NavigationLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const LoginPage = () => {
  return (
    <StyledContainer>
      <StyledCard>
        <CardContent>
          <Logo>
            <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
              AppLogo
            </Typography>
          </Logo>
          
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Welcome Back
          </Typography>
          
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Please sign in to your account
          </Typography>
          
          <LoginForm />
          
          <NavigationLinks>
            <Link href="/forgot-password" variant="body2" underline="hover">
              Forgot Password?
            </Link>
            <Link href="/register" variant="body2" underline="hover">
              Create Account
            </Link>
          </NavigationLinks>
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};