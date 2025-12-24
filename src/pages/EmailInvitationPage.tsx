import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailInvitationTemplate } from '../email-templates';

const EmailInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // Sample data for email invitation template
  const invitationData = {
    userName: 'John Doe',
    organizationName: 'TechCorp Solutions',
    invitationLink: 'https://admin.twintik.com/onboard/ff-token-abc123',
    inviterName: 'Sarah Johnson',
    inviterEmail: 'sarah.johnson@techcorp.com'
  };

  // Handle button click to navigate to profile page
  const handleSetupDigitalCard = () => {
    console.log('🎯 Navigating to profile setup page...');
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/onboard/ff-token-abc123');
    }, 500); // Small delay to show the loading state
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          📧 Email Invitation Template
        </h1>
        
        {/* Email Template */}
        <div style={{ marginBottom: '30px' }}>
          <EmailInvitationTemplate {...invitationData} onSetupClick={handleSetupDigitalCard} />
        </div>

        {/* Demo Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={handleSetupDigitalCard}
            disabled={isNavigating}
            style={{
              backgroundColor: isNavigating ? '#9ca3af' : '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isNavigating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px rgba(139, 92, 246, 0.25)',
              transition: 'all 0.2s ease',
              opacity: isNavigating ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isNavigating) {
                e.currentTarget.style.backgroundColor = '#7c3aed';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!isNavigating) {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isNavigating ? '🔄 Navigating...' : '🎯 Demo: Click "Set Up My Digital Card" Button'}
          </button>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e0e7ff', 
          borderRadius: '8px',
          border: '1px solid #c7d2fe'
        }}>
          <p style={{ margin: '0', color: '#3730a3', fontSize: '14px' }}>
            <strong>💡 Demo Instructions:</strong> Click the button above to simulate clicking the "Set Up My Digital Card" button in the email template. This will navigate to the profile setup page at <code>/onboard/ff-token-abc123</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailInvitationPage; 