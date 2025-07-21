import React from 'react';
import { TwinTikMobileAppAccessTemplate } from '../email-templates';

const TwinTikMobileAppPage: React.FC = () => {
  // Sample data for TwinTik mobile app access template
  const mobileAppData = {
    userName: 'John Doe',
    loginEmail: 'john.doe@techcorp.com',
    loginPassword: 'TempPass123!',
    appStoreLink: 'https://apps.apple.com/app/twintik/id123456789',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.twintik.app',
    digitalCardLink: 'https://twintik.com/card/john-doe-abc123'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          📱 TwinTik Mobile App Access Template
        </h1>
        
        {/* Email Template */}
        <div style={{ marginBottom: '30px' }}>
          <TwinTikMobileAppAccessTemplate {...mobileAppData} />
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e0e7ff', 
          borderRadius: '8px',
          border: '1px solid #c7d2fe'
        }}>
          <p style={{ margin: '0', color: '#3730a3', fontSize: '14px' }}>
            <strong>📱 About this template:</strong> This email is sent to users when the TwinTik mobile app is ready for access. It includes login credentials, download links, and app features overview.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwinTikMobileAppPage; 