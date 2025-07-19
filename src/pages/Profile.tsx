import React from 'react';
import ComingSoonOverlay from '../components/ComingSoonOverlay';

const Profile: React.FC = () => {
  return (
    <ComingSoonOverlay 
      title="User Profile"
      description="Manage your profile and account settings"
      phase="Q1 2024"
    />
  );
};

export default Profile; 