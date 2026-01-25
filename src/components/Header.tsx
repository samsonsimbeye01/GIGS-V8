import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Bell, MessageCircle, Settings, User, LogOut, Menu, Zap, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useLocation as useLocationContext } from '@/contexts/LocationContext';
import { useTranslation } from '@/components/SwahiliTranslations';
import IconOnlyMenu from './IconOnlyMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { country } = useLocationContext();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);
  const [isOnline, setIsOnline] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setNotifications(prev => prev + 1);
      }
      if (Math.random() > 0.9) {
        setMessages(prev => prev + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      case '/profile': return t('profile');
      case '/messages': return t('messages');
      case '/notifications': return t('notifications');
      case '/settings': return t('settings');
      default: return 'Linka';
    }
  };

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.'
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 lg:gap-4">
          {!isHome && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6870ff4c28b943de36144779_1752397058947_8956c785.jpg" 
              alt="Linka Logo" 
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {isOnline ? 'Live' : 'Offline'} • {country.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">127 Active Gigs</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">1.5K Online</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Menu Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Menu</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Icon Only Menu */}
          {showMenu && (
            <div className="absolute top-16 right-4 z-50">
              <IconOnlyMenu 
                notifications={notifications}
                messages={messages}
                onClose={() => setShowMenu(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
