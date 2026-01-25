import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface EscrowTransaction {
  id: string;
  gigId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'held' | 'released' | 'disputed' | 'refunded';
  payerId: string;
  payeeId: string;
  createdAt: Date;
  releasedAt?: Date;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'completed' | 'approved';
  completedAt?: Date;
}

interface PaymentEscrowProps {
  gigId: string;
  totalAmount: number;
  payerId: string;
  payeeId: string;
  onPaymentComplete?: (transactionId: string) => void;
}

const PaymentEscrow: React.FC<PaymentEscrowProps> = ({
  gigId,
  totalAmount,
  payerId,
  payeeId,
  onPaymentComplete
}) => {
  const [transaction, setTransaction] = useState<EscrowTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'tigo'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadTransaction();
  }, [gigId]);

  const loadTransaction = async () => {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('gig_id', gigId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setTransaction({
          ...data,
          createdAt: new Date(data.created_at),
          releasedAt: data.released_at ? new Date(data.released_at) : undefined,
          milestones: data.milestones || []
        });
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    }
  };

  const initiatePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter your mobile money number.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create escrow transaction
      const newTransaction: Partial<EscrowTransaction> = {
        gigId,
        amount: totalAmount,
        currency: 'TSH',
        status: 'pending',
        payerId,
        payeeId,
        createdAt: new Date(),
        milestones: [
          {
            id: '1',
            description: 'Initial payment hold',
            amount: totalAmount,
            status: 'pending'
          }
        ]
      };

      const { data, error } = await supabase
        .from('escrow_transactions')
        .insert({
          gig_id: gigId,
          amount: totalAmount,
          currency: 'TSH',
          status: 'pending',
          payer_id: payerId,
          payee_id: payeeId,
          payment_method: paymentMethod,
          phone_number: phoneNumber
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate mobile money payment
      await simulateMobileMoneyPayment(paymentMethod, phoneNumber, totalAmount);
      
      // Update transaction status
      const { error: updateError } = await supabase
        .from('escrow_transactions')
        .update({ status: 'held' })
        .eq('id', data.id);

      if (updateError) throw updateError;

      setTransaction({
        ...newTransaction,
        id: data.id,
        status: 'held'
      } as EscrowTransaction);

      toast({
        title: 'Payment Successful',
        description: 'Funds are now held in escrow until work is completed.'
      });

      onPaymentComplete?.(data.id);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateMobileMoneyPayment = async (method: string, phone: string, amount: number) => {
    // Simulate API call to mobile money provider
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Simulated ${method.toUpperCase()} payment: ${phone} - ${amount} TSH`);
        resolve(true);
      }, 2000);
    });
  };

  const releasePayment = async () => {
    if (!transaction) return;

    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;

      setTransaction({
        ...transaction,
        status: 'released',
        releasedAt: new Date()
      });

      toast({
        title: 'Payment Released',
        description: 'Funds have been released to the worker.'
      });
    } catch (error) {
      console.error('Release error:', error);
      toast({
        title: 'Release Failed',
        description: 'There was an error releasing the payment.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const disputePayment = async () => {
    if (!transaction) return;

    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .update({ status: 'disputed' })
        .eq('id', transaction.id);

      if (error) throw error;

      setTransaction({
        ...transaction,
        status: 'disputed'
      });

      toast({
        title: 'Dispute Initiated',
        description: 'A dispute has been raised. Our team will review within 24 hours.'
      });
    } catch (error) {
      console.error('Dispute error:', error);
    }
  };

  const getStatusIcon = (status: EscrowTransaction['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'held': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'released': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'refunded': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: EscrowTransaction['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'held': return 'bg-blue-100 text-blue-800';
      case 'released': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Secure Payment Escrow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!transaction ? (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your payment will be held securely until work is completed and approved.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold">{totalAmount.toLocaleString()} TSH</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method:</label>
                <div className="flex gap-2">
                  {['mpesa', 'airtel', 'tigo'].map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod(method as any)}
                    >
                      {method.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number:</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+255 XXX XXX XXX"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <Button
                onClick={initiatePayment}
                disabled={isProcessing || !phoneNumber}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : `Pay ${totalAmount.toLocaleString()} TSH`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(transaction.status)}
                <span className="font-medium">Transaction Status</span>
              </div>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">{transaction.amount.toLocaleString()} {transaction.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="text-sm text-muted-foreground">
                  {transaction.createdAt.toLocaleDateString()}
                </span>
              </div>
              {transaction.releasedAt && (
                <div className="flex justify-between">
                  <span>Released:</span>
                  <span className="text-sm text-muted-foreground">
                    {transaction.releasedAt.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            {transaction.status === 'held' && (
              <div className="flex gap-2">
                <Button
                  onClick={releasePayment}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Release Payment
                </Button>
                <Button
                  onClick={disputePayment}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Dispute
                </Button>
              </div>
            )}
            
            {transaction.status === 'disputed' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This payment is under dispute review. Our team will contact you within 24 hours.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentEscrow;