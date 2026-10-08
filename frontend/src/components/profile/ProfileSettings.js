import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [preferences, setPreferences] = useState({
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    newsletter: true
  });

  const [travelDocuments, setTravelDocuments] = useState({
    passportNumber: '',
    passportExpiry: '',
    passportCountry: '',
    visaInfo: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const userData = await fetch('/api/user/profile').then(res => res.json());
      
      setPersonalInfo({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        nationality: userData.nationality || '',
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || '',
        postalCode: userData.postalCode || ''
      });

      setSecurityInfo({
        ...securityInfo,
        twoFactorEnabled: userData.twoFactorEnabled || false
      });

      setPreferences({
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
        language: userData.preferences?.language || 'en',
        currency: userData.preferences?.currency || 'USD',
        timezone: userData.preferences?.timezone || 'UTC',
        emailNotifications: userData.preferences?.emailNotifications ?? true,
        smsNotifications: userData.preferences?.smsNotifications ?? false,
        marketingEmails: userData.preferences?.marketingEmails ?? false,
        newsletter: userData.preferences?.newsletter ?? true
      });

      setTravelDocuments({
        passportNumber: userData.travelDocuments?.passportNumber || '',
        passportExpiry: userData.travelDocuments?.passportExpiry || '',
        passportCountry: userData.travelDocuments?.passportCountry || '',
        visaInfo: userData.travelDocuments?.visaInfo || '',
        emergencyContact: userData.travelDocuments?.emergencyContact || '',
        emergencyPhone: userData.travelDocuments?.emergencyPhone || ''
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!personalInfo.email.trim()) newErrors.email = 'Email is required';
    if (personalInfo.email && !/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (personalInfo.phone && !/^\+?[\d\s-()]+$/.test(personalInfo.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    return newErrors;
  };

  const validateSecurity = () => {
    const newErrors = {};
    if (securityInfo.newPassword && !securityInfo.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (securityInfo.newPassword && securityInfo.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const validateTravelDocuments = () => {
    const newErrors = {};
    if (travelDocuments.passportNumber && travelDocuments.passportNumber.length < 6) {
      newErrors.passportNumber = 'Passport number is too short';
    }
    if (travelDocuments.passportExpiry) {
      const expiryDate = new Date(travelDocuments.passportExpiry);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.passportExpiry = 'Passport expiry date must be in the future';
      }
    }
    return newErrors;
  };

  const savePersonalInfo = async () => {
    const validationErrors = validatePersonalInfo();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await fetch('/api/user/profile/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalInfo)
      });
      setSuccessMessage('Personal information updated successfully');
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to update personal information' });
    } finally {
      setLoading(false);
    }
  };

  const saveSecurity = async () => {
    const validationErrors = validateSecurity();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await fetch('/api/user/profile/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityInfo.currentPassword,
          newPassword: securityInfo.newPassword,
          twoFactorEnabled: securityInfo.twoFactorEnabled
        })
      });
      setSuccessMessage('Security settings updated successfully');
      setSecurityInfo({ ...securityInfo, currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to update security settings' });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
    try {
      setLoading(true);
      await fetch('/api/user/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      setSuccessMessage('Preferences updated successfully');
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to update preferences' });
    } finally {
      setLoading(false);
    }
  };

  const saveTravelDocuments = async () => {
    const validationErrors = validateTravelDocuments();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await fetch('/api/user/profile/travel-documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(travelDocuments)
      });
      setSuccessMessage('Travel documents updated successfully');
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to update travel documents' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrors({});
  };

  const renderPersonalInfo = () => (
    <div className="tab-content">
      <h3>Personal Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Nationality</label>
          <input
            type="text"
            value={personalInfo.nationality}
            onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
          />
        </div>
        <div className="form-group full-width">
          <label>Address</label>
          <input
            type="text"
            value={personalInfo.address}
            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={personalInfo.city}
            onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={personalInfo.country}
            onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            value={personalInfo.postalCode}
            onChange={(e) => setPersonalInfo({ ...personalInfo, postalCode: e.target.value })}
          />
        </div>
      </div>
      <button onClick={savePersonalInfo} disabled={loading} className="save-btn">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  const renderSecurity = () => (
    <div className="tab-content">
      <h3>Security Settings</h3>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="twoFactorEnabled"
                  checked={settings.twoFactorEnabled || false}
                  onChange={handleToggle}
                />
                Enable Two-Factor Authentication
              </label>
            </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={securityInfo.currentPassword}
            onChange={(e) => setSecurityInfo({ ...securityInfo, currentPassword: e.target.value })}
            className={errors.currentPassword ? 'error' : ''}
          />
          {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={securityInfo.newPassword}
            onChange={(e) => setSecurityInfo({ ...securityInfo, newPassword: e.target.value })}
            className={errors.newPassword ? 'error' : ''}
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={securityInfo.confirmPassword}
            onChange={(e) => setSecurityInfo({ ...securityInfo, confirmPassword: e.target.value })}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        <div className="form-group full-width">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={securityInfo.twoFactorEnabled}
              onChange={(e) => setSecurityInfo({ ...securityInfo, twoFactorEnabled: e.target.checked })}
            />
            Enable Two-Factor Authentication
          </label>
        </div>
      </div>
      <button onClick={saveSecurity} disabled={loading} className="save-btn">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  const renderPreferences = () => (
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
    <div className="tab-content">
      <h3>Preferences</h3>
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Language</label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div className="form-group full-width">
          <h4>Notification Preferences</h4>
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
              />
              Email Notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
              />
              SMS Notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.marketingEmails}
                onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
              />
              Marketing Emails
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={(e) => setPreferences({ ...preferences, newsletter: e.target.checked })}
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
              />
              Newsletter
            </label>
          </div>
        </div>
      </div>
      <button onClick={savePreferences} disabled={loading} className="save-btn">
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  const renderTravelDocuments = () => (
    <div className="tab-content">
      <h3>Travel Documents</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Passport Number</label>
          <input
            type="text"
            value={travelDocuments.passportNumber}
            onChange={(e) => setTravelDocuments({ ...travelDocuments, passportNumber: e.target.value })}
            className={errors.passportNumber ? 'error' : ''}
          />
          {errors.passportNumber && <span className="error-message">{errors.passportNumber}</span>}
        </div>
        <div className="form-group">
          <label>Passport Expiry Date</label>
          <input
            type="date"
            value={travelDocuments.passportExpiry}
            onChange={(e) => setTravelDocuments({ ...travelDocuments, passportExpiry: e.target.value })}
            className={errors.passportExpiry ? 'error' : ''}
          />
          {errors.passportExpiry && <span className="error-message">{errors.passportExpiry}</span>}
        </div>
        <div className="form-group">
          <label>Passport Issuing Country</label>
          <input
            type="text"
            value={travelDocuments.passportCountry}
            onChange={(e) => setTravelDocuments({ ...travelDocuments, passportCountry: e.target.value })}
          />
        </div>
        <div className="form-group full-width">
          <label>Visa Information</label>
          <textarea
            value={travelDocuments.visaInfo}
            onChange={(e) => setTravelDocuments({ ...travelDocuments, visaInfo: e.target.value })}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Emergency Contact Name</label>
          <input
            type="text"
            value={travelDocuments.emergencyContact}
            onChange={(e) => setTravelDocuments({ ...travelDocuments, emergencyContact: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Emergency Contact Phone</label>
          <input
            type="tel"
            value={travelDocuments.emergencyPhone}
            onChange={(e) => setTravelDocuments({ ...travelDocuments, emergencyPhone: e.target.value })}
          />
        </div>
      </div>
      <button onClick={saveTravelDocuments} disabled={loading} className="save-btn">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  const tabs = [
    { id: 'personal', label: 'Personal Info', content: renderPersonalInfo },
    { id: 'security', label: 'Security', content: renderSecurity },
    { id: 'preferences', label: 'Preferences', content: renderPreferences },
            <div className="form-group">
              <label>Notifications:</label>
              <div className="notification-settings">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications || false}
                    onChange={handleToggle}
                  />
                  Email Notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications || false}
                    onChange={handleToggle}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Currency:</label>
              <select
                name="preferredCurrency"
                value={settings.preferredCurrency || "USD"}
                onChange={handleSelectChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={settings.language || "en"}
                onChange={handleSelectChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
    { id: 'travel', label: 'Travel Documents', content: renderTravelDocuments }
  ];

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Profile Settings</h2>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button onClick={clearMessages} className="close-btn">×</button>
        </div>
      )}

      {errors.general && (
        <div className="error-message">
          {errors.general}
          <button onClick={clearMessages} className="close-btn">×</button>
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                clearMessages();
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content-wrapper">
          {tabs.find(tab => tab.id === activeTab)?.content()}
        </div>
      </div>
    </div>
  );
};

export { ProfileSettings };