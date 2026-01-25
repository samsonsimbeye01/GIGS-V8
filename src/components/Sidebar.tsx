import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Wallet, ChevronRight, ChevronLeft } from 'lucide-react';
import IconOnlyMenu from './IconOnlyMenu';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [unreadMessages] = useState(2);
  const [unreadNotifications] = useState(3);

  const stats = [
    {
      label: 'Completed Gigs',
      value: '127',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Total Earnings',
      value: '2.45M TSH',
      icon: Wallet,
      color: 'text-blue-600'
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto transition-all duration-300`}>
      <div className="p-4 space-y-6">
        {/* Toggle Button */}
        <div className="flex justify-between items-center">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900">Menu</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Icon Only Menu */}
        <div className="space-y-3">
          {!isCollapsed && <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Navigation</h3>}
          <IconOnlyMenu 
            unreadMessages={unreadMessages}
            unreadNotifications={unreadNotifications}
            className={isCollapsed ? 'items-center' : ''}
          />
        </div>

        {!isCollapsed && (
          <>
            <Separator />

            {/* Stats Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Stats</h3>
                <div className="space-y-3">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${stat.color}`} />
                          <span className="text-xs text-gray-600">{stat.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Live Status */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Live Status</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">You're online and visible to clients</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Response Rate</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
              </CardContent>
            </Card>

            {/* App Version */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-400">Linka v2.0</p>
              <p className="text-xs text-gray-400">East Africa Gig Platform</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;