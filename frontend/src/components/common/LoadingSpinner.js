import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100px',
  padding: theme.spacing(2),
}));

const LoadingSpinner = ({ 
  size = 40, 
  color = 'primary', 
  thickness = 3.6,
  centered = true,
  fullScreen = false,
  className = '',
  ...props 
}) => {
  const spinner = (
    <CircularProgress
      size={size}
      color={color}
      thickness={thickness}
      {...props}
    />
  );

  if (fullScreen) {
    return (
      <Box
        className={className}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        {spinner}
      </Box>
    );
  }

  if (centered) {
    return (
      <StyledLoadingContainer className={className}>
        {spinner}
      </StyledLoadingContainer>
    );
  }

  return <Box className={className}>{spinner}</Box>;
};

export { LoadingSpinner };