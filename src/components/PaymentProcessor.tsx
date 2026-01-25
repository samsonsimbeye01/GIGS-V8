import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Wallet, Bitcoin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { stripeService } from '@/services/stripeService';

interface PaymentProcessorProps {
  amount: number;
  currency: string;
  country: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount,
  currency,
  country,
  onSuccess,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const mobileMoney = {
    'KE': ['M-Pesa', 'Airtel Money'],
    'TZ': ['M-Pesa', 'Tigopesa', 'Airtel Money'],
    'UG': ['MTN MoMo', 'Airtel Money'],
    'GH': ['MTN MoMo', 'Vodafone Cash', 'AirtelTigo Money'],
    'NG': ['MTN MoMo', 'Airtel Money'],
    'RW': ['MTN MoMo', 'Airtel Money']
  };

  const digitalWallets = ['Flutterwave', 'Paystack', 'Chipper Cash', 'Cash App', 'Stripe Test'];
  const cryptoOptions = ['Binance Pay', 'USDT', 'Bitcoin'];

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      if (paymentMethod === 'Stripe Test') {
        const { data, error } = await stripeService.createTestPaymentIntent(amount, currency);
        if (error) throw error as any;
        toast({ title: 'Stripe Intent Created', description: `Intent ${data?.intentId || 'created'}` });
        onSuccess(data?.intentId || 'stripe-intent');
      } else {
        const { data, error } = await supabase.functions.invoke('mobile-money-payment', {
          body: {
            amount,
            currency,
            paymentMethod,
            phoneNumber: paymentMethod.includes('M-Pesa') || paymentMethod.includes('MoMo') ? phoneNumber : undefined,
            cardNumber: ['VISA', 'MasterCard', 'Verve'].includes(paymentMethod) ? cardNumber : undefined,
            country
          }
        });
        if (error) throw error;
        toast({ title: 'Payment Successful', description: `Payment of ${currency} ${amount} processed` });
        onSuccess(data.paymentId);
      }
    } catch (error: any) {
      toast({ title: 'Payment Failed', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment - {currency} {amount}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Mobile Money
          </h4>
          <div className="flex flex-wrap gap-2">
            {(mobileMoney[country as keyof typeof mobileMoney] || []).map((method) => (
              <Badge
                key={method}
                variant={paymentMethod === method ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Cards
          </h4>
          <div className="flex flex-wrap gap-2">
            {['VISA', 'MasterCard', 'Verve'].map((card) => (
              <Badge
                key={card}
                variant={paymentMethod === card ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPaymentMethod(card)}
              >
                {card}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Digital Wallets
          </h4>
          <div className="flex flex-wrap gap-2">
            {digitalWallets.map((wallet) => (
              <Badge
                key={wallet}
                variant={paymentMethod === wallet ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPaymentMethod(wallet)}
              >
                {wallet}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Bitcoin className="w-4 h-4" /> Crypto
          </h4>
          <div className="flex flex-wrap gap-2">
            {cryptoOptions.map((crypto) => (
              <Badge
                key={crypto}
                variant={paymentMethod === crypto ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPaymentMethod(crypto)}
              >
                {crypto}
              </Badge>
            ))}
          </div>
        </div>

        {paymentMethod && (
          <div className="space-y-3">
            {(paymentMethod.includes('M-Pesa') || paymentMethod.includes('MoMo')) && (
              <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            )}
            {['VISA', 'MasterCard', 'Verve'].includes(paymentMethod) && (
              <Input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={handlePayment} disabled={processing} className="flex-1">
                {processing ? 'Processing...' : `Pay ${currency} ${amount}`}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
