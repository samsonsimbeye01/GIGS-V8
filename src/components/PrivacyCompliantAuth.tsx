import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Info } from 'lucide-react';
import { PolicyComplianceService } from '@/services/policyComplianceService';
import { supabase } from '@/lib/supabase';
import { auth as firebaseAuth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { CURRENT_LEGAL_VERSION } from '@/lib/utils';

interface PrivacyCompliantAuthProps {
  onAuthSuccess?: (user: any) => void;
  mode: 'signin' | 'signup';
}

export const PrivacyCompliantAuth: React.FC<PrivacyCompliantAuthProps> = ({
  onAuthSuccess,
  mode
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: ''
  });
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [consents, setConsents] = useState({
    dataProcessing: false,
    marketing: false,
    analytics: false,
    ageVerification: false
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required consents for Google Play compliance
      if (mode === 'signup') {
        if (!consents.dataProcessing || !consents.ageVerification) {
          setError('Required consents must be accepted to create account');
          return;
        }
      }

      // Log data collection purpose for privacy compliance
      await PolicyComplianceService.logDataAccess(
        formData.email,
        'authentication',
        mode === 'signup' ? 'account_creation' : 'user_login'
      );

      let data: any = null;
      let authError: any = null;

      if (authMethod === 'email') {
        if (mode === 'signup' && (!acceptTerms || !acceptPrivacy)) {
          setError('You must accept Terms of Service and Privacy Policy');
          return;
        }
        const res = mode === 'signup'
          ? await supabase.auth.signUp({
              email: formData.email,
              password: formData.password,
              options: {
                data: {
                  full_name: formData.fullName,
                  phone: formData.phone,
                  location: formData.location,
                  consents: consents,
                  privacy_policy_accepted: true,
                  terms_accepted: true,
                  age_verified: consents.ageVerification,
                  accepted_legal_version: CURRENT_LEGAL_VERSION,
                  accepted_legal_at: new Date().toISOString()
                }
              }
            })
          : await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
            });
        data = res.data;
        authError = res.error;
      } else if (authMethod === 'phone') {
        // For phone, use OTP flow: first send code, then verify
        if (!otpSent) {
          try {
            const siteKey = (import.meta as any).env.VITE_RECAPTCHA_SITE_KEY;
            if (!siteKey) {
              setError('Missing reCAPTCHA site key. Set VITE_RECAPTCHA_SITE_KEY in environment.');
              return;
            }
            if (!recaptcha) {
              const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', { size: 'invisible' });
              setRecaptcha(verifier);
            }
            const confirmation = await signInWithPhoneNumber(firebaseAuth, formData.phone, recaptcha || new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', { size: 'invisible' }));
            (window as any).__confirmation = confirmation;
            setOtpSent(true);
          } catch (e: any) {
            if (e?.code === 'auth/operation-not-allowed') {
              setError('Phone sign-in is disabled in Firebase. Enable Phone Auth provider.');
              return;
            }
            const res = await supabase.auth.signInWithOtp({
              phone: formData.phone,
              options: { shouldCreateUser: true }
            });
            data = res.data;
            authError = res.error;
            if (!authError) setOtpSent(true);
          }
        } else {
          if (!acceptTerms || !acceptPrivacy) {
            setError('You must accept Terms of Service and Privacy Policy');
            return;
          }
          try {
            const confirmation = (window as any).__confirmation;
            const cred = await confirmation.confirm(otpCode);
            data = { user: cred.user };
            authError = null;
          } catch {
            const res = await supabase.auth.verifyOtp({
              phone: formData.phone,
              token: otpCode,
              type: 'sms'
            });
            if (!res.error) {
              await supabase.auth.updateUser({
                data: {
                  privacy_policy_accepted: true,
                  terms_accepted: true,
                  accepted_legal_version: CURRENT_LEGAL_VERSION,
                  accepted_legal_at: new Date().toISOString()
                }
              });
            }
            data = res.data;
            authError = res.error;
          }
        }
      } else if (authMethod === 'social') {
        // Default to Google for submit; individual buttons below handle specific providers
        const res = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        data = res.data;
        authError = res.error;
      }

      if (authError) throw authError;
      
      onAuthSuccess?.((data as any)?.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setLoading(true);
    setError('');
    try {
      if (provider === 'google' || provider === 'facebook') {
        const prov = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
        const result = await signInWithPopup(firebaseAuth, prov);
        onAuthSuccess?.(result.user);
      } else {
        const { data, error: authError } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin }
        });
        if (authError) throw authError;
        toast({ title: 'Redirecting', description: 'Continue in the provider window' });
      }
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        setError(`${provider} sign-in disabled. Enable this provider in Firebase Auth.`);
      } else {
        setError(err.message || 'Social sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button type="button" variant={authMethod === 'email' ? 'default' : 'outline'} onClick={() => setAuthMethod('email')}>
          Email
        </Button>
        <Button type="button" variant={authMethod === 'phone' ? 'default' : 'outline'} onClick={() => setAuthMethod('phone')}>
          Phone
        </Button>
        <Button type="button" variant={authMethod === 'social' ? 'default' : 'outline'} onClick={() => setAuthMethod('social')}>
          Social
        </Button>
      </div>
      {authMethod === 'email' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {mode === 'signup' && (
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="acceptTerms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(!!c)} />
                <label htmlFor="acceptTerms" className="text-sm">I accept the Terms of Service</label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="acceptPrivacy" checked={acceptPrivacy} onCheckedChange={(c) => setAcceptPrivacy(!!c)} />
                <label htmlFor="acceptPrivacy" className="text-sm">I accept the Privacy Policy</label>
              </div>
            </div>
          )}
        </>
      )}

      {authMethod === 'phone' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+255XXXXXXXXX"
              required
            />
          </div>
          <div id="recaptcha-container" />
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox id="acceptTerms2" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(!!c)} />
              <label htmlFor="acceptTerms2" className="text-sm">I accept the Terms of Service</label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="acceptPrivacy2" checked={acceptPrivacy} onCheckedChange={(c) => setAcceptPrivacy(!!c)} />
              <label htmlFor="acceptPrivacy2" className="text-sm">I accept the Privacy Policy</label>
            </div>
          </div>
          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter code"
                required
              />
            </div>
          )}
          <div className="flex gap-2">
            {!otpSent ? (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
            )}
          </div>
        </>
      )}

      {authMethod === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button type="button" variant="outline" onClick={() => signInWithProvider('google')}>
            Sign in with Google
          </Button>
          <Button type="button" variant="outline" onClick={() => signInWithProvider('facebook')}>
            Sign in with Facebook
          </Button>
          <Button type="button" variant="outline" onClick={() => signInWithProvider('linkedin')}>
            Sign in with LinkedIn
          </Button>
        </div>
      )}

      {mode === 'signup' && authMethod === 'email' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy & Data Protection</strong>
              <div className="space-y-3 mt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataProcessing"
                    checked={consents.dataProcessing}
                    onCheckedChange={(checked) => 
                      setConsents(prev => ({ ...prev, dataProcessing: !!checked }))
                    }
                  />
                  <label htmlFor="dataProcessing" className="text-sm">
                    I consent to processing of my personal data for service provision (Required)
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="ageVerification"
                    checked={consents.ageVerification}
                    onCheckedChange={(checked) => 
                      setConsents(prev => ({ ...prev, ageVerification: !!checked }))
                    }
                  />
                  <label htmlFor="ageVerification" className="text-sm">
                    I confirm I am 18+ years old (Required for Google Play compliance)
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={consents.marketing}
                    onCheckedChange={(checked) => 
                      setConsents(prev => ({ ...prev, marketing: !!checked }))
                    }
                  />
                  <label htmlFor="marketing" className="text-sm">
                    Send me promotional emails (Optional)
                  </label>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {authMethod === 'email' && (
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
        </Button>
      )}
    </form>
  );
};

export default PrivacyCompliantAuth;
