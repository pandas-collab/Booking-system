import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    avatar: null,
    bio: 'Software developer passionate about creating great user experiences.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joinDate: '2023-01-15',
    stats: {
      posts: 42,
      followers: 128,
      following: 86
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setEditForm(user);
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ProfileSummary = () => (
    <div className="profile-summary">
      <div className="avatar-section">
        <div className="avatar-container">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="Profile"
            className="avatar"
          />
          {isEditing && (
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <span className="upload-icon">📷</span>
            </label>
          )}
        </div>
      </div>

      <div className="user-info">
        {isEditing ? (
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="edit-input edit-name"
            placeholder="Full Name"
          />
        ) : (
          <h2 className="user-name">{user.name}</h2>
        )}

        {isEditing ? (
          <input
            type="text"
            value={editForm.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="edit-input edit-username"
            placeholder="Username"
          />
        ) : (
          <p className="username">@{user.username}</p>
        )}

        {isEditing ? (
          <textarea
            value={editForm.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="edit-input edit-bio"
            placeholder="Bio"
            rows="3"
          />
        ) : (
          <p className="bio">{user.bio}</p>
        )}

        <div className="user-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            {isEditing ? (
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="edit-input edit-location"
                placeholder="Location"
              />
            ) : (
              <span>{user.location}</span>
            )}
          </div>

          <div className="detail-item">
            <span className="detail-icon">🌐</span>
            {isEditing ? (
              <input
                type="url"
                value={editForm.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="edit-input edit-website"
                placeholder="Website"
              />
            ) : (
              <a href={user.website} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            )}
          </div>

          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span>Joined {formatDate(user.joinDate)}</span>
          </div>
        </div>

        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{user.stats.posts}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.stats.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.stats.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-actions">
            <button onClick={handleSave} className="btn btn-primary">
              Save Changes
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleEdit} className="btn btn-primary">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="tab-content">
      <h3>Profile Information</h3>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={editForm.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={editForm.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={editForm.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="form-input"
          rows="4"
        />
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="tab-content">
      <h3>Security Settings</h3>
      <div className="form-group">
        <label>Current Password</label>
        <input type="password" className="form-input" />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input type="password" className="form-input" />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <input type="password" className="form-input" />
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" />
          Enable Two-Factor Authentication
        </label>
      </div>
      <button className="btn btn-primary">Update Security Settings</button>
    </div>
  );

  const NotificationsTab = () => (
    <div className="tab-content">
      <h3>Notification Preferences</h3>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Email notifications
        </label>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Push notifications
        </label>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" />
          SMS notifications
        </label>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Marketing emails
        </label>
      </div>
      <button className="btn btn-primary">Save Preferences</button>
    </div>
  );

  const PrivacyTab = () => (
    <div className="tab-content">
      <h3>Privacy Settings</h3>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Make profile public
        </label>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" />
          Show email to other users
        </label>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Allow search engines to index profile
        </label>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" />
          Show online status
        </label>
      </div>
      <button className="btn btn-primary">Update Privacy Settings</button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'security':
        return <SecurityTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'privacy':
        return <PrivacyTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-container">
      <div className="profile-layout two-column">
        <div className="profile-sidebar">
          <ProfileSummary />
        </div>

        <div className="profile-main">
          <div className="settings-tabs">
            <nav className="tab-navigation">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => handleTabChange('security')}
              >
                Security
              </button>
              <button
                className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => handleTabChange('notifications')}
              >
                Notifications
              </button>
              <button
                className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => handleTabChange('privacy')}
              >
                Privacy
              </button>
            </nav>

            <div className="tab-panel">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;