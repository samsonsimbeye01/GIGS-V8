import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

interface NavigationHeaderProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBack = true,
  showHome = false,
  showMenu = false,
  onMenuToggle,
  isMenuOpen = false
}) => {
  const navigate = useNavigate();
  const { country, getCurrentTime } = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {showHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHome}
              className="p-2"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500">
              {country.name} • {getCurrentTime()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-xs text-gray-500">{country.currency}</p>
            <p className="text-xs text-primary font-medium">
              {country.languages[0].toUpperCase()}
            </p>
          </div>
          
          {showMenu && onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};