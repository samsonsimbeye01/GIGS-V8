import React, { useState, useEffect } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { useLocation } from '@/contexts/LocationContext';
import { useTranslation } from '@/components/SwahiliTranslations';
import Header from './Header';
import MobileHeader from './MobileHeader';
import QuickActionsBar from './QuickActionsBar';
import FunctionalDashboard from './FunctionalDashboard';
import FunctionalLiveGigsFeed from './FunctionalLiveGigsFeed';
import FunctionalAuth from './FunctionalAuth';
import FunctionalGigManager from './FunctionalGigManager';
import GeolocationPersonalization from './GeolocationPersonalization';
import EnhancedContentModerator from './EnhancedContentModerator';
import EnhancedSupportChatbot from './EnhancedSupportChatbot';
import AIJobRecommendationEngine from './AIJobRecommendationEngine';
import EnhancedFraudDetection from './EnhancedFraudDetection';
import VoiceGigPosting from './VoiceGigPosting';
import LocationAwareHeader from './LocationAwareHeader';
import LocalGigFilter from './LocalGigFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, Target, Bot, Zap, Users, TrendingUp, MapPin, Mic, Globe, Home, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

const FunctionalMainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);
  const { country } = useLocation();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [realTimeStats, setRealTimeStats] = useState({
    activeGigs: 127,
    onlineUsers: 1543,
    completedToday: 89,
    aiProtected: 99.8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        activeGigs: Math.max(0, prev.activeGigs + Math.floor(Math.random() * 3) - 1),
        onlineUsers: Math.max(100, prev.onlineUsers + Math.floor(Math.random() * 10) - 5),
        completedToday: prev.completedToday + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    toast({
      title: 'Filters Applied',
      description: `Applied ${filters.length} filters to gig search`
    });
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    toast({
      title: 'Searching...',
      description: `Looking for "${query}" in available gigs`
    });
  };

  return (
    <AppProvider>
      <FunctionalAuth>
        {(user, showAuth) => (
          <FunctionalGigManager user={user}>
            {({ gigs, loading, createGig, applyToGig, updateGigStatus, refreshGigs }) => (
              <div className="min-h-screen bg-background">
                <GeolocationPersonalization />
                <LocationAwareHeader />
                
                {!isMobile && <Header />}
                {isMobile && (
                  <MobileHeader 
                    onMenuToggle={() => {}}
                    notifications={notifications}
                    messages={messages}
                  />
                )}
                
                <main className="p-3 lg:p-6">
                  <QuickActionsBar 
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                  />

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-4 lg:mb-6">
                    <Card><CardContent className="p-3 lg:p-4"><div className="flex items-center justify-between"><div><p className="text-xs lg:text-sm text-muted-foreground">{t('totalGigs')}</p><p className="text-lg lg:text-2xl font-bold">{gigs.filter(g => g.status === 'open').length}</p></div><Zap className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500" /></div></CardContent></Card>
                    <Card><CardContent className="p-3 lg:p-4"><div className="flex items-center justify-between"><div><p className="text-xs lg:text-sm text-muted-foreground">Online Users</p><p className="text-lg lg:text-2xl font-bold">{realTimeStats.onlineUsers.toLocaleString()}</p></div><Users className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" /></div></CardContent></Card>
                    <Card><CardContent className="p-3 lg:p-4"><div className="flex items-center justify-between"><div><p className="text-xs lg:text-sm text-muted-foreground">{t('completed')}</p><p className="text-lg lg:text-2xl font-bold">{gigs.filter(g => g.status === 'completed').length}</p></div><TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" /></div></CardContent></Card>
                    <Card><CardContent className="p-3 lg:p-4"><div className="flex items-center justify-between"><div><p className="text-xs lg:text-sm text-muted-foreground">AI Protected</p><p className="text-sm lg:text-2xl font-bold">{realTimeStats.aiProtected}%</p></div><Shield className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" /></div></CardContent></Card>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                      <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs"><Home className="w-3 h-3" />{t('dashboard')}</TabsTrigger>
                      <TabsTrigger value="live" className="flex items-center gap-1 text-xs"><Zap className="w-3 h-3" />Live Gigs</TabsTrigger>
                      <TabsTrigger value="gigs" className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3" />Suggested</TabsTrigger>
                      <TabsTrigger value="voice" className="flex items-center gap-1 text-xs"><Mic className="w-3 h-3" />Voice</TabsTrigger>
                      <TabsTrigger value="matching" className="flex items-center gap-1 text-xs"><Target className="w-3 h-3" />Match</TabsTrigger>
                      <TabsTrigger value="security" className="flex items-center gap-1 text-xs"><Shield className="w-3 h-3" />Security</TabsTrigger>
                      <TabsTrigger value="support" className="flex items-center gap-1 text-xs"><Bot className="w-3 h-3" />AI</TabsTrigger>
                      <TabsTrigger value="filter" className="flex items-center gap-1 text-xs"><Globe className="w-3 h-3" />Filter</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard"><FunctionalDashboard /></TabsContent>
                    <TabsContent value="live">
                      <FunctionalLiveGigsFeed 
                        user={user}
                        gigs={gigs}
                        loading={loading}
                        onApplyToGig={applyToGig}
                        onCreateGig={createGig}
                        showAuth={showAuth}
                      />
                    </TabsContent>
                    <TabsContent value="gigs"><AIJobRecommendationEngine /></TabsContent>
                    <TabsContent value="voice"><VoiceGigPosting /></TabsContent>
                    <TabsContent value="matching"><AIJobRecommendationEngine /></TabsContent>
                    <TabsContent value="security"><EnhancedFraudDetection /></TabsContent>
                    <TabsContent value="support">
                      <Card><CardHeader><CardTitle>AI Support Assistant</CardTitle></CardHeader><CardContent><Button onClick={() => setShowChatbot(true)} className="w-full"><MessageCircle className="w-4 h-4 mr-2" />Start AI Chat Support</Button><div className="mt-4"><EnhancedContentModerator /></div></CardContent></Card>
                    </TabsContent>
                    <TabsContent value="filter"><LocalGigFilter onFilterChange={handleFilterChange} /></TabsContent>
                  </Tabs>
                </main>
                
                <EnhancedSupportChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
              </div>
            )}
          </FunctionalGigManager>
        )}
      </FunctionalAuth>
    </AppProvider>
  );
};

export default FunctionalMainApp;