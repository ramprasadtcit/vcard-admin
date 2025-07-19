import React from 'react';
import { useAuth } from '../contexts';
import PhaseRoadmap from '../components/PhaseRoadmap';

const Roadmap: React.FC = () => {
  const { user: currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Roadmap</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser?.name}! Here's our development plan and feature roadmap.
          </p>
        </div>

        {/* Roadmap Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <PhaseRoadmap />
        </div>

        {/* Current Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Development Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">5</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Phase 1 Complete</h3>
              <p className="text-sm text-gray-600">Core features implemented</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">0</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Phase 2 In Progress</h3>
              <p className="text-sm text-gray-600">Advanced features planned</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Phase 3 Planned</h3>
              <p className="text-sm text-gray-600">Enterprise features</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <h3 className="font-medium text-gray-900 mb-1">View Current Features</h3>
              <p className="text-sm text-gray-600">Explore what's available now</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <h3 className="font-medium text-gray-900 mb-1">Request Features</h3>
              <p className="text-sm text-gray-600">Suggest new functionality</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <h3 className="font-medium text-gray-900 mb-1">Report Issues</h3>
              <p className="text-sm text-gray-600">Submit bug reports</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <h3 className="font-medium text-gray-900 mb-1">View Documentation</h3>
              <p className="text-sm text-gray-600">Access user guides</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap; 