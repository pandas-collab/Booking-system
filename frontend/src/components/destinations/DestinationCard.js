import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const CardMediaStyled = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative'
}));

const WishlistButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
}));

const PriceBox = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: theme.spacing(1)
}));

const LocationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem'
}));

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);

    const message = newWishlistState ? 'Added to Wishlist' : 'Removed from Wishlist';
    setToastMessage(message);
    setShowToast(true);
  };

  const handleViewDetails = () => {
    navigate(`/destinations/${destination.id}`);
  };

  const handleCardClick = () => {
    navigate(`/destinations/${destination.id}`);
  };

  return (
    <>
      <StyledCard onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
        <CardMediaStyled
          image={destination.mainImage}
          title={destination.name}
        >
          <WishlistButton
            onClick={handleWishlistToggle}
            size="small"
          >
            {isWishlisted ? (
              <FavoriteIcon sx={{ color: '#ff4444' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </WishlistButton>
        </CardMediaStyled>

        <CardContentStyled>
          <Typography gutterBottom variant="h6" component="h3">
            {destination.name}
          </Typography>

          <LocationText variant="body2" gutterBottom>
            {destination.country}
          </LocationText>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={destination.averageRating}
              readOnly
              precision={0.1}
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({destination.reviewCount || 0})
            </Typography>
          </Box>

          <PriceBox>
            <Typography variant="body2" color="text.secondary">
              From
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${destination.startingPrice}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              View Details
            </Button>
          </PriceBox>
        </CardContentStyled>
      </StyledCard>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowToast(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DestinationCard;
