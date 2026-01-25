import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Bell, User, Settings } from 'lucide-react';

interface IconOnlyMenuProps {
  notifications?: number;
  messages?: number;
  onClose?: () => void;
}

const IconOnlyMenu: React.FC<IconOnlyMenuProps> = ({ 
  notifications = 0, 
  messages = 0,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: MessageCircle,
      label: 'Messages',
      path: '/messages',
      badge: messages
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
      badge: notifications
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      badge: null
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      badge: null
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Card className="w-48 shadow-lg">
      <CardContent className="p-2">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={index}
                variant={active ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start relative ${active ? 'bg-primary/10 text-primary' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => handleNavigation(item.path)}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default IconOnlyMenu;
