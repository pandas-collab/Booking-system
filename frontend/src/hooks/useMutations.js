import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// API functions
const createBooking = async (bookingData) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create booking');
  }

  return response.json();
};

const updateProfile = async (profileData) => {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
};

const createReview = async (reviewData) => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create review');
  }

  return response.json();
};

// Custom hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onMutate: async (newBooking) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });

      const previousBookings = queryClient.getQueryData(['bookings']);

      queryClient.setQueryData(['bookings'], (old) => {
        if (!old) return [{ ...newBooking, id: 'temp-' + Date.now(), status: 'pending' }];
        return [...old, { ...newBooking, id: 'temp-' + Date.now(), status: 'pending' }];
      });

      return { previousBookings };
    },
    onError: (err, newBooking, context) => {
      queryClient.setQueryData(['bookings'], context.previousBookings);
      toast.error(err.message || 'Failed to create booking');
    },
    onSuccess: (data) => {
      toast.success('Booking created successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (updatedProfile) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      const previousProfile = queryClient.getQueryData(['profile']);

      queryClient.setQueryData(['profile'], (old) => ({
        ...old,
        ...updatedProfile,
      }));

      return { previousProfile };
    },
    onError: (err, updatedProfile, context) => {
      queryClient.setQueryData(['profile'], context.previousProfile);
      toast.error(err.message || 'Failed to update profile');
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: ['reviews', newReview.bookingId] });

      const previousReviews = queryClient.getQueryData(['reviews', newReview.bookingId]);

      queryClient.setQueryData(['reviews', newReview.bookingId], (old) => {
        if (!old) return [{ ...newReview, id: 'temp-' + Date.now(), createdAt: new Date().toISOString() }];
        return [...old, { ...newReview, id: 'temp-' + Date.now(), createdAt: new Date().toISOString() }];
      });

      return { previousReviews, bookingId: newReview.bookingId };
    },
    onError: (err, newReview, context) => {
      queryClient.setQueryData(['reviews', context.bookingId], context.previousReviews);
      toast.error(err.message || 'Failed to create review');
    },
    onSuccess: (data, variables) => {
      toast.success('Review submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.bookingId] });
    },
  });
};