import React, { useState, useEffect } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ onClose, user }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [saved, setSaved] = useState(false);

  // Load user-specific profile data
  useEffect(() => {
    if (user?.email) {
      const storedProfile = localStorage.getItem(`profile-${user.email}`);
      if (storedProfile) {
        const { username, bio, avatar } = JSON.parse(storedProfile);
        setUsername(username || '');
        setBio(bio || '');
        setAvatar(avatar || null);
      } else {
        setUsername(user.name || '');
      }
    }
  }, [user]);

  // Save profile changes
  const handleSave = () => {
    if (user?.email) {
      const profileData = {
        username,
        bio,
        avatar,
      };
      localStorage.setItem(`profile-${user.email}`, JSON.stringify(profileData));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  // Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>My Profile</h2>

        {/* Avatar */}
        <div className="avatar-container">
          <img
            src={avatar || '/default-avatar.png'}
            alt="Avatar"
            className="avatar-preview"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        {/* Bio */}
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell something about yourself"
          />
        </div>

        <button className="save-btn" onClick={handleSave}>Save Changes</button>
        {saved && <div className="save-confirmation">✅ Profile saved!</div>}
      </div>
    </div>
  );
};

export default ProfileModal;
