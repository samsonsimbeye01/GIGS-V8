import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, MessageCircle, Plus, Search, Filter } from 'lucide-react';

interface MobileResponsiveLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  notifications?: number;
  messages?: number;
  onMenuToggle?: () => void;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  onAddClick?: () => void;
}

const MobileResponsiveLayout: React.FC<MobileResponsiveLayoutProps> = ({
  children,
  header,
  sidebar,
  notifications = 0,
  messages = 0,
  onMenuToggle,
  onNotificationClick,
  onMessageClick,
  onAddClick
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMenuToggle}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-primary">Linka</h1>
                <p className="text-xs text-muted-foreground">Gig Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onNotificationClick}
                className="relative p-2"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMessageClick}
                className="relative p-2"
              >
                <MessageCircle className="w-5 h-5" />
                {messages > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                  >
                    {messages}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-3">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
          <div className="flex items-center justify-around p-2">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Search className="w-4 h-4" />
              <span className="text-xs">Search</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Filter className="w-4 h-4" />
              <span className="text-xs">Filter</span>
            </Button>
            <Button 
              onClick={onAddClick}
              size="sm" 
              className="flex flex-col items-center gap-1 p-2 bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Post</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">Chat</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Bell className="w-4 h-4" />
              <span className="text-xs">Alerts</span>
            </Button>
          </div>
        </div>

        {/* Bottom padding to prevent content from being hidden behind bottom nav */}
        <div className="h-20"></div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      {header}
      <div className="flex">
        {sidebar && (
          <div className="w-64 border-r bg-muted/10">
            {sidebar}
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileResponsiveLayout;