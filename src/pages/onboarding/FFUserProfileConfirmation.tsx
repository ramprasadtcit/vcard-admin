import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  ArrowRight,
  Settings,
  Smartphone
} from 'lucide-react';

const FFUserProfileConfirmation: React.FC = () => {
  const location = useLocation();
  const username = location.state?.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for completing your profile setup. Our team will review your information and ship your configured NFC card to your address. You can start using your NFC card immediately once you receive it, and you'll also get access to the TwinTik mobile application.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            What Happens Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Profile Review</h3>
                <p className="text-blue-700 text-sm">Our team will review your submitted information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium text-blue-900">NFC Card Configuration</h3>
                <p className="text-blue-700 text-sm">Your NFC card will be configured with your details</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Digital Card Setup</h3>
                <p className="text-blue-700 text-sm">Your digital card will be created for sharing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-medium text-blue-900">NFC Card Delivery</h3>
                <p className="text-blue-700 text-sm">Your configured NFC card will be shipped to your address</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                5
              </div>
              <div>
                <h3 className="font-medium text-blue-900">NFC Card Ready to Use</h3>
                <p className="text-blue-700 text-sm">Once you receive your NFC card, you can start using it immediately to share your digital card</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                6
              </div>
              <div>
                <h3 className="font-medium text-blue-900">TwinTik Mobile App Access</h3>
                <p className="text-blue-700 text-sm">You'll receive login credentials to access the TwinTik mobile application and an email with tracking details</p>
              </div>
            </div>
          </div>
        </div>



        {/* TwinTik Mobile App */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            TwinTik Mobile Application
          </h2>
          <div className="space-y-4">
            <p className="text-green-800">
              The TwinTik mobile app is a separate application that provides additional features for managing your digital card. With the app, you can:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-green-900">Manage Your Digital Card</p>
                  <p className="text-sm text-green-700">Edit your profile, contact details, job title, and social media links.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  🔁
                </div>
                <div>
                  <p className="font-medium text-green-900">Share Instantly</p>
                  <p className="text-sm text-green-700">Share your digital card with anyone via QR, link, or tap.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  📊
                </div>
                <div>
                  <p className="font-medium text-green-900">Track NFC Usage</p>
                  <p className="text-sm text-green-700">Monitor how many times your card is tapped.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  👁️
                </div>
                <div>
                  <p className="font-medium text-green-900">View Analytics</p>
                  <p className="text-sm text-green-700">Know who viewed your card and when.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  💳
                </div>
                <div>
                  <p className="font-medium text-green-900">Apple Wallet & Google Wallet</p>
                  <p className="text-sm text-green-700">Add your digital card directly to your mobile wallet for instant access.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> The TwinTik mobile app is currently in app store review. You'll receive an email with login credentials and download instructions once the app is available. Your NFC card works independently and can be used immediately upon receipt.
              </p>
            </div>

          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Email Support</p>
                <p className="text-sm text-purple-700">support@twintik.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.open(username ? `https://twintik.com/${username}` : 'https://twintik.com', '_blank')}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Visit your digital card
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() => window.open('mailto:support@twintik.com', '_blank')}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Contact Support
            <Mail className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Thank you for choosing our digital card solution. We're excited to help you connect better!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FFUserProfileConfirmation; 