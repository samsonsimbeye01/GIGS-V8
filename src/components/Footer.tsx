import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield, Globe, Users, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useLiveData } from './LiveDataProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AISupportChatbot from './AISupportChatbot';
import ComplianceMonitor from './ComplianceMonitor';
import LegalDialog from './LegalDialog';
import PlatformDialog from './PlatformDialog';
import SupportDialog from './SupportDialog';

const Footer: React.FC = () => {
  const { country } = useLocation();
  const { onlineUsers, gigs } = useLiveData();
  const currentYear = new Date().getFullYear();
  const [showAIChat, setShowAIChat] = React.useState(false);
  const [showReport, setShowReport] = React.useState(false);
  const [showLegal, setShowLegal] = React.useState(false);
  const [legalDoc, setLegalDoc] = React.useState<'legal_notice' | 'privacy_policy' | 'terms_of_service' | 'cookie_policy' | 'compliance_statement'>('legal_notice');
  const [showPlatform, setShowPlatform] = React.useState(false);
  const [platformTab, setPlatformTab] = React.useState<'how' | 'find' | 'post' | 'stories'>('how');
  const [showSupportModal, setShowSupportModal] = React.useState(false);
  const [supportTab, setSupportTab] = React.useState<'help' | 'contact' | 'community'>('help');
  const todayStr = new Date().toDateString();
  const completedToday = React.useMemo(() => {
    try {
      return gigs.filter(g => g.status === 'completed' && new Date(g.updated_at).toDateString() === todayStr).length;
    } catch {
      return 0;
    }
  }, [gigs, todayStr]);

  const footerLinks = {
    platform: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Find Work', href: '/gigs' },
      { label: 'Post a Gig', href: '/create' },
      { label: 'Success Stories', href: '/stories' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'AI Support', href: '/ai-support' },
      { label: 'Community', href: '/community' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/legal' },
      { label: 'Terms of Service', href: '/legal' },
      { label: 'Cookie Policy', href: '/legal' },
      { label: 'Compliance', href: '/compliance' }
    ],
    company: [
      { label: 'About Linka', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partners', href: '/partners' }
    ]
  };

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">Linka</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Africa's leading gig platform connecting skilled workers with opportunities across the continent. 
              Google Play policy compliant and AI-powered for your safety.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Policy Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>{country?.name || 'Africa'}</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  {link.label === 'How It Works' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setPlatformTab('how'); setShowPlatform(true); }}>
                      How It Works
                    </Button>
                  )}
                  {link.label === 'Find Work' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setPlatformTab('find'); setShowPlatform(true); }}>
                      Find Work
                    </Button>
                  )}
                  {link.label === 'Post a Gig' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setPlatformTab('post'); setShowPlatform(true); }}>
                      Post a Gig
                    </Button>
                  )}
                  {link.label === 'Success Stories' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setPlatformTab('stories'); setShowPlatform(true); }}>
                      Success Stories
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  {link.label === 'Help Center' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setSupportTab('help'); setShowSupportModal(true); }}>
                      Help Center
                    </Button>
                  )}
                  {link.label === 'Contact Us' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setSupportTab('contact'); setShowSupportModal(true); }}>
                      Contact Us
                    </Button>
                  )}
                  {link.label === 'AI Support' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => setShowAIChat(true)}>
                      AI Support
                    </Button>
                  )}
                  {link.label === 'Community' && (
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setSupportTab('community'); setShowSupportModal(true); }}>
                      Community
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setLegalDoc('privacy_policy'); setShowLegal(true); }}>
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setLegalDoc('terms_of_service'); setShowLegal(true); }}>
                  Terms of Service
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setLegalDoc('cookie_policy'); setShowLegal(true); }}>
                  Cookie Policy
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => { setLegalDoc('compliance_statement'); setShowLegal(true); }}>
                  Compliance
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Contact & Social Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@linka.africa</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+255768027086</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button size="sm" className="w-full justify-start" onClick={() => setShowAIChat(true)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Support Chat
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => setShowReport(true)}>
                <Shield className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users:</span>
                <span className="font-medium">{onlineUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gigs Completed Today:</span>
                <span className="font-medium">{completedToday.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">{country?.name || 'Africa'}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} Linka Africa. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for Africa</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <span className="text-muted-foreground">v2.1.0</span>
          </div>
        </div>
        <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Support Chat</DialogTitle>
            </DialogHeader>
            <AISupportChatbot isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
          </DialogContent>
        </Dialog>
        <LegalDialog open={showLegal} onOpenChange={setShowLegal} initialDoc={legalDoc} />
        <PlatformDialog open={showPlatform} onOpenChange={setShowPlatform} initialTab={platformTab} onAskAI={() => setShowAIChat(true)} />
        <SupportDialog open={showSupportModal} onOpenChange={setShowSupportModal} initialTab={supportTab} onAskAI={() => setShowAIChat(true)} />
        <Dialog open={showReport} onOpenChange={setShowReport}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
            </DialogHeader>
            <ComplianceMonitor />
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
};

export default Footer;
