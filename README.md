# TwinTik Admin Portal

A clean, modular, and responsive React admin portal for TwinTik - a digital identity platform. This application supports multi-level admin management with role-based access control and modern UI design.

## 🎯 Role-Based Access Control

### **Super Admin** (`john@twintik.com`)
- Full platform control with ability to manage platform admins
- Manage organizations, subscription plans, and global settings
- Process NFC requests and manage B2C users
- Send broadcasts and view activity logs
- Manage support tickets

### **Platform Admin** (`alex.johnson@twintik.com`)
- Platform-level management assisting Super Admin
- Manage organizations and subscription plans
- Process NFC requests and manage B2C users
- Send broadcasts and view activity logs
- Manage support tickets

### **Org Admin** (`sarah@techcorp.com`)
- Organization-level management with user and template control
- Manage team users and assign roles
- Configure NFC settings and customize themes
- View subscription details and analytics
- Manage organization settings

### **Org Sub Admin** (`mike@techcorp.com`)
- Limited access for managing assigned users
- View basic analytics and activity logs
- Raise support tickets

## 🚀 Features

### 📊 Dashboard & Analytics
- Role-specific statistics and metrics
- Real-time data visualization
- Interactive charts and graphs
- Quick action buttons

### 👥 User Management
- Role-based user lists and filtering
- User status management
- Organization-based access control
- Invitation and onboarding flows

### 🏢 Organization Management
- View and manage registered organizations
- Organization statistics and details
- Admin user management
- Subscription and billing management

### 📱 NFC Management
- Request-based NFC card configuration
- Custom URL support for third-party NFC
- TwinTik fulfillment options
- Approval and processing workflows

### 🎨 Theme & Branding
- Organization-level theme customization
- Logo upload and management
- Color and font customization
- User restriction settings

### 📋 Support & Communication
- Support ticket management
- Broadcast and announcement system
- Activity logs and audit trails
- Role-based communication channels

## 🛠 Tech Stack

- **React 18** with TypeScript
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Role-based route guards** for security

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vcard-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Demo Credentials

Use these credentials to test different roles:

#### Super Admin
- Email: `john@twintik.com`
- Password: `password`

#### Platform Admin
- Email: `alex.johnson@twintik.com`
- Password: `password`

#### Org Admin
- Email: `sarah@techcorp.com`
- Password: `password`

#### Org Sub Admin
- Email: `mike@techcorp.com`
- Password: `password`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar and top bar
│   ├── Sidebar.tsx     # Navigation sidebar with role-based filtering
│   ├── TopBar.tsx      # Top navigation bar
│   ├── RouteGuard.tsx  # Role-based route protection
│   └── ComingSoonOverlay.tsx # Placeholder for future features
├── contexts/           # React Context for state management
│   └── AuthContext.tsx
├── constants/          # Application constants
│   ├── routes.ts       # Route definitions and permissions
│   └── roles.ts        # Role and permission definitions
├── pages/              # Page components
│   ├── Dashboard.tsx   # Role-specific dashboard
│   ├── Users.tsx       # User management
│   ├── Organizations.tsx # Organization management
│   ├── NFCRequests.tsx # NFC request processing
│   └── ...            # Other page components
├── types/              # TypeScript interfaces
│   └── index.ts
└── App.tsx            # Main application component
```

## 🎨 Design Features

### Modern UI/UX
- Clean, minimalist design
- Responsive layout with mobile-first approach
- Collapsible sidebar navigation
- Role-based color coding
- Interactive hover states and transitions

### Navigation Structure
- Hierarchical navigation with nested items
- Role-based menu filtering
- Active state indicators
- Badge notifications for pending items
- "Coming Soon" indicators for future features

### Dashboard Features
- Role-specific statistics cards
- Quick action buttons
- Recent activity feed
- Performance metrics with trend indicators
- Real-time data updates

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication (simulated)
- Role-based route protection
- Permission-based feature access
- Session management
- Secure logout functionality

### Route Guards
- Automatic redirect to login for unauthenticated users
- Role-based access control for all routes
- Graceful error handling for unauthorized access
- Loading states during authentication checks

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Adaptive navigation
- Responsive data tables and forms

## 🚧 Development Status

### Phase 1 (Current)
- ✅ Core authentication and routing
- ✅ Role-based access control
- ✅ Dashboard with role-specific stats
- ✅ Navigation structure
- ✅ Basic page scaffolding

### Phase 2 (Coming Soon)
- 🔄 User management forms
- 🔄 Organization management
- 🔄 NFC request processing
- 🔄 Theme customization
- 🔄 Support ticket system

### Phase 3 (Future)
- 📋 Advanced analytics
- 📋 Real-time notifications
- 📋 API integrations
- 📋 Advanced reporting
- 📋 Mobile app

## 🛠 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
