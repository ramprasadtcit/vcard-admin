import React from 'react';

interface TwinTikMobileAppAccessTemplateProps {
  userName: string;
  loginEmail: string;
  loginPassword: string;
  appStoreLink: string;
  playStoreLink: string;
  digitalCardLink: string;
}

const TwinTikMobileAppAccessTemplate: React.FC<TwinTikMobileAppAccessTemplateProps> = ({
  userName,
  loginEmail,
  loginPassword,
  appStoreLink,
  playStoreLink,
  digitalCardLink
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: '#8b5cf6', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '10px 10px 0 0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          📱 TwinTik Mobile App
        </div>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '0 0 10px 10px',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ color: '#1e293b', margin: '0 0 10px 0', fontSize: '28px' }}>
            Your Mobile App is Ready!
          </h1>
          <p style={{ color: '#64748b', margin: '0', fontSize: '16px' }}>
            Access advanced features and analytics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Hi <strong>{userName}</strong>,
        </p>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Exciting news! The TwinTik mobile app is now available and ready for you to download. This app will give you complete control over your digital card with advanced features and analytics.
        </p>

        {/* Login Credentials */}
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#92400e', margin: '0 0 15px 0', fontSize: '18px' }}>
            🔑 Your Login Credentials
          </h3>
          <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Email:</strong> {loginEmail}
            </p>
            <p style={{ margin: '0 0 15px 0' }}>
              <strong>Password:</strong> {loginPassword}
            </p>
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '0' }}>
              ⚠️ Please change your password after your first login for security
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #22c55e', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#15803d', margin: '0 0 15px 0', fontSize: '18px' }}>
            📲 Download the TwinTik App
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <a 
              href={appStoreLink}
              style={{
                backgroundColor: '#000000',
                color: 'white',
                padding: '12px 20px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              📱 App Store
            </a>
            <a 
              href={playStoreLink}
              style={{
                backgroundColor: '#01875f',
                color: 'white',
                padding: '12px 20px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              🤖 Google Play
            </a>
          </div>
        </div>

        {/* App Features */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          border: '1px solid #3b82f6', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#1d4ed8', margin: '0 0 15px 0', fontSize: '18px' }}>
            ✨ What You Can Do with the App
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>✓ Manage Your Digital Card</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Edit profile, contact details, and social links</p>
              
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>🔁 Share Instantly</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Share via QR, link, or tap</p>
            </div>
            <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>📊 Track NFC Usage</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Monitor card taps and analytics</p>
              
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>👁️ View Analytics</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>See who viewed your card and when</p>
            </div>
          </div>
        </div>

        {/* Wallet Integration */}
        {/* <div style={{ 
          backgroundColor: '#fdf2f8', 
          border: '1px solid #ec4899', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#be185d', margin: '0 0 15px 0', fontSize: '18px' }}>
            💳 Apple Wallet & Google Wallet
          </h3>
          <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
            Add your digital card directly to your mobile wallet for instant access:
          </p>
          <ul style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '5px' }}>Quick access without opening the app</li>
            <li style={{ marginBottom: '5px' }}>Works offline</li>
            <li style={{ marginBottom: '0' }}>Seamless integration with your existing wallet</li>
          </ul>
        </div> */}

        {/* Quick Access */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h3 style={{ color: '#374151', margin: '0 0 15px 0', fontSize: '18px' }}>
            🚀 Quick Access to Your Digital Card
          </h3>
          <a 
            href={digitalCardLink}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            View My Digital Card
          </a>
        </div>

        {/* Getting Started */}
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#0369a1', margin: '0 0 15px 0', fontSize: '18px' }}>
            🎯 Getting Started
          </h3>
          <ol style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Download the TwinTik app from your device's app store</li>
            <li style={{ marginBottom: '8px' }}>Open the app and tap "Login"</li>
            <li style={{ marginBottom: '8px' }}>Enter your email and password (provided above)</li>
            <li style={{ marginBottom: '8px' }}>Change your password for security</li>
            <li style={{ marginBottom: '0' }}>Start exploring your digital card features!</li>
          </ol>
        </div>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '0' }}>
          Welcome to the complete TwinTik experience!<br />
          <strong>The TwinTik Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', color: '#6b7280', fontSize: '12px' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          Need help? Contact us at <a href="mailto:support@twintik.com" style={{ color: '#6366f1' }}>support@twintik.com</a>
        </p>
        <p style={{ margin: '0' }}>
          © 2024 TwinTik. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TwinTikMobileAppAccessTemplate; 