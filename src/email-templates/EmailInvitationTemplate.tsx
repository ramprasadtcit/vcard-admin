import React from 'react';

interface EmailInvitationTemplateProps {
  userName: string;
  organizationName: string;
  invitationLink: string;
  inviterName: string;
  inviterEmail: string;
  onSetupClick?: () => void;
}

const EmailInvitationTemplate: React.FC<EmailInvitationTemplateProps> = ({
  userName,
  organizationName,
  invitationLink,
  inviterName,
  inviterEmail,
  onSetupClick
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: '#6366f1', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '10px 10px 0 0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          TwinTik Digital Card
        </div>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '0 0 10px 10px',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ color: '#1e293b', margin: '0 0 10px 0', fontSize: '28px' }}>
            You're Invited!
          </h1>
          <p style={{ color: '#64748b', margin: '0', fontSize: '16px' }}>
            Set up your professional digital card
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Hi <strong>{userName}</strong>,
        </p>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          You've been invited by <strong>{inviterName}</strong> from <strong>{organizationName}</strong> to create your professional digital card with TwinTik.
        </p>

        <div style={{ 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#0369a1', margin: '0 0 15px 0', fontSize: '18px' }}>
            🎯 What You'll Get:
          </h3>
          <ul style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: '0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>A physical NFC card for instant sharing</li>
            <li style={{ marginBottom: '8px' }}>Digital card accessible via QR code and link</li>
            <li style={{ marginBottom: '8px' }}>Analytics to track who views your card</li>
            <li style={{ marginBottom: '8px' }}>Mobile app for advanced management</li>
            {/* <li style={{ marginBottom: '0' }}>Apple Wallet & Google Wallet integration</li> */}
          </ul>
        </div>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '25px' }}>
          Click the button below to set up your profile and get started with your digital card:
        </p>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {onSetupClick ? (
            <button
              onClick={onSetupClick}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block',
                boxShadow: '0 4px 6px rgba(99, 102, 241, 0.25)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Set Up My Digital Card
            </button>
          ) : (
            <a 
              href={invitationLink.replace('twintik.com', 'admin.twintik.com')}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block',
                boxShadow: '0 4px 6px rgba(99, 102, 241, 0.25)'
              }}
            >
              Set Up My Digital Card
            </a>
          )}
        </div>

        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '25px'
        }}>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '0', textAlign: 'center' }}>
            <strong>⏰ This invitation expires in 7 days</strong>
          </p>
        </div>

        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '10px', 
          borderRadius: '5px', 
          fontSize: '12px', 
          color: '#374151',
          wordBreak: 'break-all',
          marginBottom: '25px'
        }}>
          {invitationLink.replace('twintik.com', 'admin.twintik.com')}
        </p>

        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '0' }}>
          Best regards,<br />
          <strong>The TwinTik Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', color: '#6b7280', fontSize: '12px' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          Questions? Contact us at <a href="mailto:support@twintik.com" style={{ color: '#6366f1' }}>support@twintik.com</a>
        </p>
        <p style={{ margin: '0' }}>
          © 2024 TwinTik. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default EmailInvitationTemplate; 