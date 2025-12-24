import React from 'react';

interface NFCConfigurationConfirmationTemplateProps {
  userName: string;
  trackingNumber: string;
  estimatedDelivery: string;
  digitalCardLink: string;
  qrCodeUrl: string;
}

const NFCConfigurationConfirmationTemplate: React.FC<NFCConfigurationConfirmationTemplateProps> = ({
  userName,
  trackingNumber,
  estimatedDelivery,
  digitalCardLink,
  qrCodeUrl
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: '#10b981', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '10px 10px 0 0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          ✅ NFC Card Ready!
        </div>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '0 0 10px 10px',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ color: '#1e293b', margin: '0 0 10px 0', fontSize: '28px' }}>
            Your NFC Card is Configured & Shipped!
          </h1>
          <p style={{ color: '#64748b', margin: '0', fontSize: '16px' }}>
            Start sharing your digital card immediately
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Hi <strong>{userName}</strong>,
        </p>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Great news! Your NFC card has been successfully configured with your profile information and is now on its way to you. You can start using your digital card right away, even before the physical card arrives.
        </p>

        {/* Digital Card Section */}
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #22c55e', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#15803d', margin: '0 0 15px 0', fontSize: '18px' }}>
            🚀 Your Digital Card is Live!
          </h3>
          <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0 0 15px 0' }}>
            Share your digital card immediately using the link below:
          </p>
          <div style={{ textAlign: 'center' }}>
            <a 
              href={digitalCardLink}
              style={{
                backgroundColor: '#22c55e',
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
        </div>

        {/* Shipping Information */}
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#92400e', margin: '0 0 15px 0', fontSize: '18px' }}>
            📦 Shipping Information
          </h3>
          <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Tracking Number:</strong> {trackingNumber}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Estimated Delivery:</strong> {estimatedDelivery}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Status:</strong> <span style={{ color: '#22c55e' }}>✅ Shipped</span>
            </p>
          </div>
        </div>

        {/* How to Use */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          border: '1px solid #3b82f6', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#1d4ed8', margin: '0 0 15px 0', fontSize: '18px' }}>
            💳 How to Use Your NFC Card
          </h3>
          <ol style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Once received, simply tap your NFC card on any smartphone</li>
            <li style={{ marginBottom: '8px' }}>The recipient's phone will automatically open your digital card</li>
            <li style={{ marginBottom: '8px' }}>They can save your contact information instantly</li>
            <li style={{ marginBottom: '0' }}>You'll receive analytics on who viewed your card</li>
          </ol>
        </div>

        {/* QR Code Section */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h3 style={{ color: '#374151', margin: '0 0 15px 0', fontSize: '18px' }}>
            📱 QR Code for Sharing
          </h3>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px',
            display: 'inline-block'
          }}>
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              style={{ 
                width: '150px', 
                height: '150px',
                border: '1px solid #e5e7eb'
              }}
            />
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '10px 0 0 0' }}>
              Scan to view your digital card
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ 
          backgroundColor: '#fdf2f8', 
          border: '1px solid #ec4899', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#be185d', margin: '0 0 15px 0', fontSize: '18px' }}>
            🔄 What's Next?
          </h3>
          <ul style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Your NFC card will arrive within 2-3 business days</li>
            <li style={{ marginBottom: '8px' }}>You'll receive TwinTik mobile app access once it's available</li>
            <li style={{ marginBottom: '8px' }}>Track your card usage and analytics through the app</li>
            {/* <li style={{ marginBottom: '0' }}>Add your card to Apple Wallet or Google Wallet</li> */}
          </ul>
        </div>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '0' }}>
          Welcome to the future of networking!<br />
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

export default NFCConfigurationConfirmationTemplate; 