import React from 'react';
import { NFCConfigurationConfirmationTemplate } from '../email-templates';

const NFCConfirmationPage: React.FC = () => {
  // Sample data for NFC configuration confirmation template
  const nfcData = {
    userName: 'John Doe',
    trackingNumber: 'TN123456789US',
    estimatedDelivery: 'December 15, 2024',
    digitalCardLink: 'https://twintik.com/card/john-doe-abc123',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://twintik.com/card/john-doe-abc123'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          ✅ NFC Configuration Confirmation Template
        </h1>
        
        {/* Email Template */}
        <div style={{ marginBottom: '30px' }}>
          <NFCConfigurationConfirmationTemplate {...nfcData} />
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#dcfce7', 
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <p style={{ margin: '0', color: '#166534', fontSize: '14px' }}>
            <strong>📦 About this template:</strong> This email is sent to users after their NFC card has been configured and shipped. It includes tracking information, digital card access, and usage instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFCConfirmationPage; 