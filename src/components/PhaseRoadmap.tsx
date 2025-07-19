import React from 'react';
import { CheckCircle, Clock, Sparkles, TrendingUp, Users, CreditCard, Wifi, Palette } from 'lucide-react';

interface PhaseFeature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'in-progress' | 'planned';
}

interface Phase {
  name: string;
  description: string;
  features: PhaseFeature[];
  color: string;
}

const PhaseRoadmap: React.FC = () => {
  const phases: Phase[] = [
    {
      name: 'Phase 1 - Core Features',
      description: 'Essential features for basic platform operation',
      color: 'bg-green-500',
      features: [
        {
          title: 'User Management',
          description: 'Basic user CRUD operations and role management',
          icon: Users,
          status: 'completed'
        },
        {
          title: 'Organization Management',
          description: 'B2B organization setup and management',
          icon: Users,
          status: 'completed'
        },
        {
          title: 'Basic NFC Management',
          description: 'Simple NFC card configuration and status tracking',
          icon: Wifi,
          status: 'completed'
        },
        {
          title: 'Subscription Plans',
          description: 'Basic subscription plan management',
          icon: CreditCard,
          status: 'completed'
        },
        {
          title: 'Card Templates',
          description: 'Basic card template management',
          icon: Palette,
          status: 'completed'
        }
      ]
    },
    {
      name: 'Phase 2 - Advanced Features',
      description: 'Enhanced functionality and analytics',
      color: 'bg-blue-500',
      features: [
        {
          title: 'Advanced Analytics',
          description: 'Detailed analytics and reporting across all modules',
          icon: TrendingUp,
          status: 'planned'
        },
        {
          title: 'Bulk Operations',
          description: 'Export/import functionality for all data types',
          icon: Users,
          status: 'planned'
        },
        {
          title: 'Advanced NFC Features',
          description: 'Custom NFC designs, usage analytics, and automation',
          icon: Wifi,
          status: 'planned'
        },
        {
          title: 'Payment Integration',
          description: 'Stripe integration for subscription billing',
          icon: CreditCard,
          status: 'planned'
        },
        {
          title: 'Template Designer',
          description: 'Visual template designer with drag-and-drop',
          icon: Palette,
          status: 'planned'
        }
      ]
    },
    {
      name: 'Phase 3 - Enterprise Features',
      description: 'Enterprise-grade features and integrations',
      color: 'bg-purple-500',
      features: [
        {
          title: 'API Access',
          description: 'RESTful API for third-party integrations',
          icon: Sparkles,
          status: 'planned'
        },
        {
          title: 'Advanced Security',
          description: '2FA, SSO, and enterprise security features',
          icon: Sparkles,
          status: 'planned'
        },
        {
          title: 'White-label Solutions',
          description: 'Custom branding and white-label options',
          icon: Sparkles,
          status: 'planned'
        },
        {
          title: 'Multi-tenant Architecture',
          description: 'Advanced multi-tenant support',
          icon: Sparkles,
          status: 'planned'
        },
        {
          title: 'Advanced Workflows',
          description: 'Custom approval workflows and automation',
          icon: Sparkles,
          status: 'planned'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'planned':
        return <Sparkles className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Development Roadmap</h2>
        <p className="text-gray-600">Our planned features and development phases</p>
      </div>

      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="relative">
            {/* Phase Header */}
            <div className="flex items-center mb-6">
              <div className={`w-4 h-4 rounded-full ${phase.color} mr-4`}></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{phase.name}</h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.features.map((feature, featureIndex) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={featureIndex}
                    className={`p-4 rounded-lg border ${
                      feature.status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : feature.status === 'in-progress'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-white">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      {getStatusIcon(feature.status)}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Status Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseRoadmap; 