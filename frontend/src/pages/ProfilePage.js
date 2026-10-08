import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user from localStorage or auth context
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const targetUserId = userId || currentUser.id;
        
        if (!targetUserId) {
          navigate('/login');
          return;
        }

        setIsOwnProfile(!userId || userId === currentUser.id);

        // Fetch user profile data
        const response = await fetch(`/api/users/${targetUserId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    if (isOwnProfile) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  const handleNavigateToEdit = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
             Back to Dashboard
          </button>
          <h1>Profile Settings</h1>
        </div>
        <Header />
        <main className="profile-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
             Back to Dashboard
          </button>
          <h1>Profile Settings</h1>
        </div>
        <Header />
        <main className="profile-content">
          <div className="error-message">
            <h2>Error Loading Profile</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
        <div className="page-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
             Back to Dashboard
          </button>
          <h1>Profile Settings</h1>
        </div>
      <Header />
      <main className="profile-content">
        <div className="profile-container">
          <div className="profile-header">
            <nav className="profile-nav">
              <button 
                onClick={() => navigate(-1)} 
                className="back-button"
                aria-label="Go back"
              >
                ← Back
              </button>
              {isOwnProfile && (
                <div className="profile-actions">
                  <button 
                    onClick={handleNavigateToEdit}
                    className="edit-profile-button"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={handleNavigateToSettings}
                    className="settings-button"
                  >
                    Settings
                  </button>
                </div>
              )}
            </nav>
          </div>
          
          <div className="profile-main">
            <UserProfile 
              user={user}
              isOwnProfile={isOwnProfile}
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;