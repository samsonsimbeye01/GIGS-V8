import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, X } from 'lucide-react';
import IconOnlyMenu from './IconOnlyMenu';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeGigs: number;
  unreadMessages: number;
  unreadNotifications: number;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeGigs, 
  unreadMessages, 
  unreadNotifications 
}) => {
  const quickActions = [
    { icon: Plus, label: 'Post New Gig', action: () => console.log('Post gig') },
    { icon: Search, label: 'Find Gigs', action: () => console.log('Find gigs') }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6870ff4c28b943de36144779_1752397058947_8956c785.jpg" 
                alt="Linka Logo" 
                className="w-8 h-8 object-contain"
              />
              <SheetTitle className="text-lg font-bold">Linka</SheetTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="p-4 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Quick Actions</h3>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  onClick={() => { action.action(); onClose(); }}
                  className="w-full justify-start bg-primary text-primary-foreground"
                  size="sm"
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Navigation</h3>
            <div className="grid grid-cols-4 gap-2 justify-items-center">
              <IconOnlyMenu 
                unreadMessages={unreadMessages}
                unreadNotifications={unreadNotifications}
                className="flex-row space-y-0 space-x-2"
              />
            </div>
          </div>

          <Separator />

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Live Status</span>
            </div>
            <p className="text-xs text-gray-600">You're online and visible to clients</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;