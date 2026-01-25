import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageCircle, Menu, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconOnlyMenu from './IconOnlyMenu';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  notifications: number;
  messages: number;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuToggle, notifications, messages }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const isHome = location.pathname === '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Linka';
      case '/profile': return 'Profile';
      case '/messages': return 'Messages';
      case '/notifications': return 'Notifications';
      case '/settings': return 'Settings';
      default: return 'Linka';
    }
  };

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isHome ? (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2" onClick={() => navigate('/')}>
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6870ff4c28b943de36144779_1752397058947_8956c785.jpg" 
              alt="Linka Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isHome && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Icon Only Menu */}
      {showMenu && (
        <div className="absolute top-16 left-4 z-50">
          <IconOnlyMenu 
            notifications={notifications}
            messages={messages}
            onClose={() => setShowMenu(false)}
          />
        </div>
      )}
    </header>
  );
};

export default MobileHeader;