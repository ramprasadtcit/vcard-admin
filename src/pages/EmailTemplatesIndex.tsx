import React from 'react';
import { Link } from 'react-router-dom';

const EmailTemplatesIndex: React.FC = () => {
  const templates = [
    {
      id: 'invitation',
      title: '📧 Email Invitation Template',
      description: 'Invitation email sent to new users to set up their digital card',
      route: '/email-invitation',
      color: '#8b5cf6'
    },
    {
      id: 'nfc-confirmation',
      title: '✅ NFC Configuration Confirmation',
      description: 'Confirmation email sent after NFC card is configured and shipped',
      route: '/nfc-confirmation',
      color: '#10b981'
    },
    {
      id: 'mobile-app',
      title: '📱 TwinTik Mobile App Access',
      description: 'Email sent when mobile app is ready with login credentials',
      route: '/twintik-mobile-app',
      color: '#6366f1'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#333', fontSize: '32px' }}>
          📧 Email Templates
        </h1>
        
        <div style={{ 
          backgroundColor: '#e0e7ff', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '40px',
          border: '1px solid #c7d2fe'
        }}>
          <p style={{ margin: '0', color: '#3730a3', fontSize: '16px', textAlign: 'center' }}>
            <strong>🎯 Interactive Email Templates</strong><br />
            Click on any template below to view it.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {templates.map((template) => (
            <Link
              key={template.id}
              to={template.route}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = template.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: template.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '20px',
                    fontSize: '24px'
                  }}>
                    {template.title.split(' ')[0]}
                  </div>
                  <h2 style={{ 
                    margin: '0', 
                    color: '#1f2937', 
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    {template.title}
                  </h2>
                </div>
                
                <p style={{ 
                  margin: '0', 
                  color: '#6b7280', 
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  {template.description}
                </p>
                
                <div style={{ 
                  marginTop: '15px', 
                  color: template.color, 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  → Click to view template
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '12px',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#92400e' }}>
            💡 How to Use:
          </h3>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#92400e',
            lineHeight: '1.6'
          }}>
            <li><strong>Email Invitation:</strong> View the invitation email template</li>
            <li><strong>NFC Confirmation:</strong> View the shipping confirmation and digital card access template</li>
            <li><strong>Mobile App Access:</strong> See the template with login credentials and app download links</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesIndex; 