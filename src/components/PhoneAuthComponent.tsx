import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Phone, Check, Mail } from 'lucide-react';

interface PhoneAuthComponentProps {
  onSuccess: (user: any) => void;
}

const PhoneAuthComponent: React.FC<PhoneAuthComponentProps> = ({ onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [useEmail, setUseEmail] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 0 && !digits.startsWith('255')) {
      if (digits.startsWith('0')) {
        return '+255' + digits.substring(1);
      } else if (digits.length === 9) {
        return '+255' + digits;
      }
    }
    if (digits.startsWith('255')) {
      return '+' + digits;
    }
    return '+' + digits;
  };

  const sendOTP = async () => {
    if (useEmail && !email) {
      toast({ title: 'Error', description: 'Please enter your email', variant: 'destructive' });
      return;
    }
    if (!useEmail && !phone) {
      toast({ title: 'Error', description: 'Please enter your phone number', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      if (useEmail) {
        // Use email magic link instead of phone OTP
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: true
          }
        });
        
        if (error) throw error;
        
        toast({ 
          title: 'Magic Link Sent!', 
          description: `Check your email at ${email} for the login link` 
        });
        
        // For email, we don't need OTP input
        onSuccess({ email });
      } else {
        // Fallback to email if phone fails
        const formattedPhone = formatPhoneNumber(phone);
        
        try {
          const { error } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
            options: {
              shouldCreateUser: true
            }
          });
          
          if (error) {
            // If phone fails, switch to email
            console.warn('Phone OTP failed, switching to email:', error.message);
            setUseEmail(true);
            toast({ 
              title: 'Phone verification unavailable', 
              description: 'Please use email verification instead',
              variant: 'destructive'
            });
            return;
          }
          
          setOtpSent(true);
          setCountdown(60);
          
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          toast({ 
            title: 'OTP Sent!', 
            description: `Verification code sent to ${formattedPhone}` 
          });
        } catch (phoneError: any) {
          console.warn('Phone auth failed, switching to email:', phoneError);
          setUseEmail(true);
          toast({ 
            title: 'Phone verification unavailable', 
            description: 'Please use email verification instead',
            variant: 'destructive'
          });
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to send verification', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: 'Error', description: 'Please enter the 6-digit OTP', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            phone: formattedPhone,
            phone_verified: true,
            full_name: data.user.user_metadata?.full_name || 'User',
            provider: 'phone'
          }, {
            onConflict: 'id'
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
        
        toast({ 
          title: 'Success!', 
          description: 'Phone number verified successfully' 
        });
        
        onSuccess(data.user);
      }
    } catch (error: any) {
      console.error('OTP verify error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Invalid OTP', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {useEmail ? <Mail className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
          {useEmail ? 'Email Verification' : 'Phone Verification'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <>
            {useEmail ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send you a magic link to sign in
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712 345 678 or +255712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your phone number to receive an OTP
                </p>
              </div>
            )}
            
            <Button 
              onClick={sendOTP} 
              disabled={loading || (useEmail ? !email : !phone)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Sending...' : (useEmail ? 'Send Magic Link' : 'Send OTP')}
            </Button>
            
            <Button 
              onClick={() => setUseEmail(!useEmail)}
              variant="ghost"
              className="w-full"
            >
              {useEmail ? 'Use Phone Instead' : 'Use Email Instead'}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-lg text-center tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Code sent to {formatPhoneNumber(phone)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={verifyOTP} 
                disabled={loading || otp.length !== 6}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Verifying...' : (
                  <><Check className="h-4 w-4 mr-2" />Verify</>
                )}
              </Button>
              
              <Button 
                onClick={sendOTP} 
                disabled={countdown > 0 || loading}
                variant="outline"
                className="flex-1"
              >
                {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
              </Button>
            </div>
            
            <Button 
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setCountdown(0);
              }}
              variant="ghost"
              className="w-full"
            >
              Change Phone Number
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneAuthComponent;