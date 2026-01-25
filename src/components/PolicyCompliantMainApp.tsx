import React, { useState, useEffect } from 'react';
import { LiveDataProvider, useLiveData } from './LiveDataProvider';
import PrivacyCompliantAuth from './PrivacyCompliantAuth';
import PolicyCompliantGigForm from './PolicyCompliantGigForm';
import ComplianceMonitor from './ComplianceMonitor';
import AdminLegalPanel from './AdminLegalPanel';
import LegalConsentOverlay from './LegalConsentOverlay';
import AdminUserPanel from './AdminUserPanel';
import Footer from './Footer';
import { ManadaEventsList } from './ManadaEventsList';
import { OpportunityFeed } from './OpportunityFeed';
import { useLocation } from '@/contexts/LocationContext';
import { useTranslation } from '@/components/SwahiliTranslations';
import Header from './Header';
import FunctionalDashboard from './FunctionalDashboard';
import MnadaAuction from './MnadaAuction';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { MessageCircle, Shield, Zap, Users, TrendingUp, Home, Plus, Briefcase, Bot, MessageSquare, Gavel, Wallet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';
import { gigService } from '@/services/gigService';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { PolicyComplianceService } from '@/services/policyComplianceService';

const PolicyCompliantMainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [showGigForm, setShowGigForm] = useState(false);
  const { user, gigs, location, createGig, applyToGig, loading, onlineUsers } = useLiveData();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const [realTimeStats, setRealTimeStats] = useState({
    activeGigs: gigs.length || 0
  });
  const [msgCount, setMsgCount] = useState(2);
  const [notifCount, setNotifCount] = useState(1);
  const [completedToday, setCompletedToday] = useState(0);
  const [paymentsToday, setPaymentsToday] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLegalAdmin, setShowLegalAdmin] = useState(false);
  const [showUsersAdmin, setShowUsersAdmin] = useState(false);
  const [instruments, setInstruments] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    setRealTimeStats(prev => ({ ...prev, activeGigs: gigs.length || 127 }));
    try {
      const todayStr = new Date().toDateString();
      setCompletedToday(
        gigs.filter(g => g.status === 'completed' && new Date(g.updated_at).toDateString() === todayStr).length
      );
      const completedIds = gigs.filter(g => g.status === 'completed').map(g => g.id);
      (async () => {
        if (completedIds.length > 0) {
          const { payments } = await gigService.getPaymentsForJobs(completedIds);
          const count = Object.entries(payments).length;
          setPaymentsToday(count);
        } else {
          setPaymentsToday(0);
        }
      })();
    } catch {
      setCompletedToday(0);
      setPaymentsToday(0);
    }
  }, [gigs]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setMsgCount(prev => prev + 1);
      }
      if (Math.random() > 0.88) {
        setNotifCount(prev => prev + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const requiredEnv = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_DATABASE_URL',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_RECAPTCHA_SITE_KEY'
    ];
    const env: any = (import.meta as any).env;
    const missing = requiredEnv.filter(k => !env[k]);
    if (missing.length > 0) {
      toast({
        title: 'Environment Warning',
        description: `Missing Firebase variables: ${missing.join(', ')}`,
      });
    }
  }, []);

  const requireAuth = (action: string, callback: () => void) => {
    if (!user) {
      toast({ title: 'Sign In Required', description: `Please sign in to ${action}` });
      setShowAuth(true);
      return;
    }
    callback();
  };

  const handleGigCreated = (gig: any) => {
    toast({ title: 'Success', description: 'Policy-compliant gig created successfully!' });
    setShowGigForm(false);
  };

  const handleApplyToGig = async (gigId: string, budget: number) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    await PolicyComplianceService.logDataAccess(
      user.id,
      'gig_application',
      'user_applied_to_gig'
    );
    
    applyToGig(gigId, 'I am interested in this gig', budget);
    toast({ title: 'Applied!', description: 'Your application has been submitted.' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isMobile && <Header />}
      
      <main className="flex-1 p-2 lg:p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-3 lg:mb-4">
          <Card><CardContent className="p-2 lg:p-3"><div className="flex items-center justify-between"><div><p className="text-[11px] lg:text-xs text-muted-foreground">{t('totalGigs')}</p><p className="text-base lg:text-xl font-bold">{realTimeStats.activeGigs}</p></div><Zap className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" /></div></CardContent></Card>
          <Card><CardContent className="p-2 lg:p-3"><div className="flex items-center justify-between"><div><p className="text-[11px] lg:text-xs text-muted-foreground">Online Users</p><p className="text-base lg:text-xl font-bold">{onlineUsers.toLocaleString()}</p></div><Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" /></div></CardContent></Card>
          <Card><CardContent className="p-2 lg:p-3"><div className="flex items-center justify-between"><div><p className="text-[11px] lg:text-xs text-muted-foreground">{t('completed')}</p><p className="text-base lg:text-xl font-bold">{completedToday}</p></div><TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" /></div></CardContent></Card>
          <Card><CardContent className="p-2 lg:p-3"><div className="flex items-center justify-between"><div><p className="text-[11px] lg:text-xs text-muted-foreground">Payments Today</p><p className="text-sm lg:text-xl font-bold">{paymentsToday}</p></div><Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" /></div></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="dashboard"><Home className="w-3 h-3" />{t('dashboard')}</TabsTrigger>
            <TabsTrigger value="opportunities"><TrendingUp className="w-3 h-3" />Opportunities</TabsTrigger>
            <TabsTrigger value="mnada"><Gavel className="w-3 h-3" />Mnada</TabsTrigger>
            <TabsTrigger value="messages"><MessageSquare className="w-3 h-3" />Messages</TabsTrigger>
            <TabsTrigger value="profile"><Users className="w-3 h-3" />Profile</TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="compliance"><Shield className="w-3 h-3" />Policy</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <FunctionalDashboard hideWelcomeHero={showWelcome} />
            <div className="mt-6 text-center space-x-4">
              <Button onClick={() => requireAuth('post a gig', () => setShowGigForm(true))}>
                <Plus className="w-4 h-4 mr-2" />Post a Gig
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
                <Briefcase className="w-4 h-4 mr-2" />Find Work
              </Button>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <h2 className="text-xl font-bold mb-2">Kazi – Immediate Work</h2>
                  <p className="text-sm text-muted-foreground mb-4">Same-day and next-day jobs near you.</p>
                  {gigs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No immediate jobs yet. Be the first to post one.</p>
                  ) : (
                    <div className="space-y-3">
                      {gigs.slice(0, 5).map((gig) => (
                        <Card key={gig.id}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm lg:text-base">{gig.title}</h3>
                                  {gig.policy_compliant && (
                                    <Shield className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                                <p className="text-xs lg:text-sm text-muted-foreground mt-1 line-clamp-2">{gig.description}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs lg:text-sm">
                                  <span className="font-medium">{formatCurrency(gig.budget, gig.currency)}</span>
                                  <span className="text-muted-foreground">{gig.location}</span>
                                  <span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] lg:text-xs">{gig.status}</span>
                                </div>
                              </div>
                              <Button size="sm" onClick={() => handleApplyToGig(gig.id, gig.budget)}>
                                Apply
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <h2 className="text-xl font-bold mb-2">Gigi – Short Gigs & Tasks</h2>
                  <p className="text-sm text-muted-foreground mb-4">Flexible tasks that run for a few hours or days.</p>
                  <p className="text-sm text-muted-foreground">Use the same gig posting flow. Over time, scheduled and milestone-based gigs will appear here as the ecosystem grows.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities">
            <div className="space-y-4">
              <OpportunityFeed />
            </div>
          </TabsContent>

          <TabsContent value="mnada">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">Mnada – Live Auctions</h2>
                <p className="text-muted-foreground mb-4">Bid live on short gigs and tasks. Highest valid bid wins at end time.</p>
                <div className="mb-8">
                  <ManadaEventsList />
                </div>
                <MnadaAuction />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card><CardContent className="p-6 text-center">
              {user ? (
                <div><h2 className="text-xl font-semibold mb-4">Messages</h2><p className="text-muted-foreground">Your conversations will appear here</p></div>
              ) : (
                <div><p className="mb-4">Sign in to access messaging</p><Button onClick={() => setShowAuth(true)}>Sign In</Button></div>
              )}
            </CardContent></Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card><CardContent className="p-6 text-center">
              {user ? (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Welcome, {user.full_name}!</h2>
                  <p className="text-muted-foreground mb-1">Role: {user.role}</p>
                  <p className="text-muted-foreground mb-4">Location: {location?.country}</p>
                  <div className="inline-block text-left">
                    <p className="text-sm font-semibold">Mana – Trust Score</p>
                    <p className="text-2xl font-bold text-primary">72</p>
                    <p className="text-xs text-muted-foreground">Bronze level. Complete more safe gigs to grow your score.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Active Gigs</p><p className="text-lg font-bold">{gigs.filter(g => ['open','assigned','in_progress'].includes(g.status)).length}</p></CardContent></Card>
                    <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{gigs.filter(g => g.status === 'completed').length}</p></CardContent></Card>
                    <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Payments Today</p><p className="text-lg font-bold">{paymentsToday}</p></CardContent></Card>
                    <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">Online Users</p><p className="text-lg font-bold">{onlineUsers}</p></CardContent></Card>
                  </div>
                  {user.role === 'admin' && (
                    <div className="mt-6">
                      <Button variant="outline" onClick={() => setShowLegalAdmin(true)}>Open Legal Admin</Button>
                      <Button variant="outline" className="ml-2" onClick={() => setShowUsersAdmin(true)}>Open Users Admin</Button>
                      <div className="mt-4 text-left">
                        <p className="text-sm font-semibold mb-2">Supabase Demo – Instruments</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              try {
                                const { data, error } = await supabase.from('instruments').select('*').limit(10);
                                if (error) throw error;
                                setInstruments((data || []) as Array<{ id: number; name: string }>);
                                toast({ title: 'Loaded', description: `Fetched ${data?.length || 0} instruments` });
                              } catch {
                                toast({ title: 'Query Error', description: 'Ensure table exists and keys are set', variant: 'destructive' });
                              }
                            }}
                          >
                            Load Instruments
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setInstruments([])}
                          >
                            Clear
                          </Button>
                        </div>
                        {instruments.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {instruments.map(i => (
                              <Card key={i.id}><CardContent className="p-2 text-sm">{i.name}</CardContent></Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div><p className="mb-4">Sign in to view your profile</p><Button onClick={() => setShowAuth(true)}>Sign In</Button></div>
              )}
            </CardContent></Card>
          </TabsContent>
          
          {user?.role === 'admin' && (
            <TabsContent value="compliance">
              <ComplianceMonitor />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <Footer />
      <LegalConsentOverlay />
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Welcome</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.full_name || 'Guest'}!</h1>
                <p className="text-white/90">You have {gigs.length} active gigs and {msgCount} recent activities</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => requireAuth('post a gig', () => setShowGigForm(true))} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Post New Gig</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => setActiveTab('dashboard')}>Find Gigs</Button>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => setShowWelcome(false)}>Dismiss</Button>
              <Button variant="ghost" className="text-white" onClick={() => setShowWelcome(false)}>Later</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showLegalAdmin} onOpenChange={setShowLegalAdmin}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Legal Admin</DialogTitle>
          </DialogHeader>
          <AdminLegalPanel />
        </DialogContent>
      </Dialog>
      <Dialog open={showUsersAdmin} onOpenChange={setShowUsersAdmin}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Users Admin</DialogTitle>
          </DialogHeader>
          <AdminUserPanel />
        </DialogContent>
      </Dialog>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          <TooltipProvider>
            <div className="grid grid-cols-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`relative flex items-center justify-center py-2 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('dashboard')}
                    aria-label="Dashboard"
                    title="Dashboard"
                  >
                    <Home className="w-5 h-5" />
                    {notifCount > 0 && (
                      <span className="absolute top-1 right-6 bg-red-500 text-white text-[10px] leading-3 rounded-full px-1">
                        {notifCount > 99 ? '99+' : notifCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center py-2 ${activeTab === 'opportunities' ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('opportunities')}
                    aria-label="Opportunities"
                    title="Opportunities"
                  >
                    <TrendingUp className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Opportunities</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`relative flex items-center justify-center py-2 ${activeTab === 'messages' ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('messages')}
                    aria-label="Messages"
                    title="Messages"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {msgCount > 0 && (
                      <span className="absolute top-1 right-6 bg-red-500 text-white text-[10px] leading-3 rounded-full px-1">
                        {msgCount > 99 ? '99+' : msgCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Messages</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center py-2 ${activeTab === 'mnada' ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('mnada')}
                    aria-label="Mnada"
                    title="Mnada"
                  >
                    <Gavel className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Mnada</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      )}
      
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In to Linka</DialogTitle>
          </DialogHeader>
          <PrivacyCompliantAuth
            mode="signin"
            onAuthSuccess={() => setShowAuth(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showGigForm} onOpenChange={setShowGigForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Policy-Compliant Gig</DialogTitle>
          </DialogHeader>
          <PolicyCompliantGigForm
            onGigCreated={handleGigCreated}
            onClose={() => setShowGigForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PolicyCompliantMainApp: React.FC = () => {
  return (
    <LiveDataProvider>
      <PolicyCompliantMainAppContent />
    </LiveDataProvider>
  );
};

export default PolicyCompliantMainApp;
