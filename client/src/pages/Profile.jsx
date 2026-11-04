import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/app.js';
import './Profile.css';

function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setProfileMsg(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await api.put('/api/auth/me', profileForm);
      const updatedUser = res.data?.data || res.data?.user || { ...user, ...profileForm };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordMsg(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account information</p>
        </div>
      </div>

      <div className="profile-body">
        {/* Profile Card */}
        <div className="profile-card card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">{user?.name || '—'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user?.email || '—'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-ET', {
                      year: 'numeric',
                      month: 'long',
                    })
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="card">
          <h2 className="section-form-title">Edit Profile</h2>

          {profileMsg && (
            <div className={`alert ${profileMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">Full Name</label>
              <input
                id="prof-name"
                name="name"
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-email">Email Address</label>
              <input
                id="prof-email"
                name="email"
                type="email"
                className="form-input"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-submit">
              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? (
                  <><span className="btn-spinner" /> Saving...</>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="section-form-title">Change Password</h2>

          {passwordMsg && (
            <div className={`alert ${passwordMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="curr-pass">Current Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="curr-pass"
                  name="currentPassword"
                  type={showPasswords ? 'text' : 'password'}
                  className="form-input with-icon with-icon-right"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPasswords(!showPasswords)}
                  aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                >
                  {showPasswords ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">New Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔑</span>
                <input
                  id="new-pass"
                  name="newPassword"
                  type={showPasswords ? 'text' : 'password'}
                  className="form-input with-icon"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="conf-pass">Confirm New Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔑</span>
                <input
                  id="conf-pass"
                  name="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  className="form-input with-icon"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repeat new password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-submit">
              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? (
                  <><span className="btn-spinner" /> Changing...</>
                ) : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
