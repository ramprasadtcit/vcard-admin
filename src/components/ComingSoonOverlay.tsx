import React from 'react';
import { Construction, Clock } from 'lucide-react';

interface ComingSoonOverlayProps {
  title: string;
  description?: string;
  phase?: string;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ 
  title, 
  description = "This feature is coming soon!",
  phase 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Clock className="w-8 h-8 text-gray-300 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        
        {phase && (
          <p className="text-sm text-gray-500">
            Phase: {phase}
          </p>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            This feature is currently in development and will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay; 