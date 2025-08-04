import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Shield, 
  Palette,
  X,
  Wifi,
  FileText,
  Eye,
  Headphones,
  User,
  ChevronDown,
  ChevronRight,
  Megaphone,
  Bot,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NAVIGATION_ITEMS } from '../constants/routes';
import twintikLogo from '../assets/twintik-logo.svg';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => {
      // If the clicked item is already expanded, close it
      if (prev.includes(path)) {
        return prev.filter(item => item !== path);
      }
      // If clicking a new parent, close all other expanded items and open the new one
      return [path];
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Home: LayoutDashboard,
      Users: Users,
      Building: Building2,
      Smartphone: Wifi,
      Palette: Palette,
      Shield: Shield,
      Activity: BarChart3,
      FileText: FileText,
      CreditCard: CreditCard,
      UserCheck: Users,
      Eye: Eye,
      Headphones: Headphones,
      User: User,
      Megaphone: Megaphone,
      Settings: Settings,
      Bot: Bot,
      UserPlus: UserPlus,
    };
    return iconMap[iconName] || LayoutDashboard;
  };

  const getFilteredNavigationItems = () => {
    if (!currentUser) return [];

    return NAVIGATION_ITEMS.filter(item => 
      item.roles.includes(currentUser.role)
    ).map(item => ({
      ...item,
      children: item.children?.filter(child => 
        child.roles.includes(currentUser.role)
      )
    }));
  };

  const renderNavigationItem = (item: any, level: number = 0) => {
    const Icon = getIconComponent(item.icon);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const isActiveItem = isActive(item.path);
    const isParentActive = hasChildren && item.children.some((child: any) => isActive(child.path));

    return (
      <div key={item.path}>
        {hasChildren ? (
          // Parent item with children
          <div>
            <button
              onClick={() => toggleExpanded(item.path)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200
                ${isParentActive 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${level > 0 ? 'pl-8' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {isExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child: any) => renderNavigationItem(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          // Regular item
          <Link
            to={item.path}
            className={`
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
              ${isActiveItem 
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                : 'text-gray-700 hover:bg-gray-100'
              }
              ${level > 0 ? 'pl-8' : ''}
            `}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
            {item.comingSoon && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                Soon
              </span>
            )}
          </Link>
        )}
      </div>
    );
  };

  const navigationItems = getFilteredNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col items-center justify-center p-6 border-b border-gray-200">
            <img src={twintikLogo} alt="TwinTik Logo" className="w-20 h-4 mb-2" />
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map(item => renderNavigationItem(item))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 