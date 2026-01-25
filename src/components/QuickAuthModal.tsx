import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Phone, Zap, Users } from 'lucide-react';
import PhoneAuthComponent from './PhoneAuthComponent';
import SocialAuthButtons from './SocialAuthButtons';
import AuthModal from './AuthModal';

interface QuickAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const QuickAuthModal: React.FC<QuickAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('phone');

  const handleSuccess = (user: any) => {
    onSuccess(user);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-primary flex items-center justify-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Login to Linka
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Africa's fastest growing gig platform
          </p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="phone" className="flex items-center gap-1 text-xs">
              <Phone className="h-3 w-3" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1 text-xs">
              <Users className="h-3 w-3" />
              Social
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1 text-xs">
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="phone" className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Phone className="h-4 w-4" />
                Most Popular in Africa
              </div>
            </div>
            <PhoneAuthComponent onSuccess={handleSuccess} />
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Sign in with your existing social accounts
            </div>
            <SocialAuthButtons onSuccess={handleSuccess} />
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Traditional email and password login
            </div>
            <AuthModal 
              isOpen={true} 
              onClose={() => {}} 
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAuthModal;