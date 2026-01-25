import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye, Pause } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { gigService } from '@/services/gigService';
import { useLiveData } from './LiveDataProvider';
import ReviewRatingSystem from '@/components/ReviewRatingSystem';

export type GigStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' | 'under_review';

interface GigStatusManagerProps {
  gigId: string;
  currentStatus: GigStatus;
  userRole: 'worker' | 'employer' | 'admin';
  onStatusChange: (newStatus: GigStatus) => void;
}

const GigStatusManager: React.FC<GigStatusManagerProps> = ({
  gigId,
  currentStatus,
  userRole,
  onStatusChange
}) => {
  const [updating, setUpdating] = useState(false);
  const [reason, setReason] = useState('');
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<GigStatus | null>(null);
  const { user } = useLiveData();
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const statusConfig = {
    open: { icon: Clock, color: 'bg-blue-500', label: 'Open' },
    assigned: { icon: Pause, color: 'bg-indigo-500', label: 'Assigned' },
    in_progress: { icon: Pause, color: 'bg-yellow-500', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'bg-red-500', label: 'Cancelled' },
    disputed: { icon: AlertTriangle, color: 'bg-orange-500', label: 'Disputed' },
    under_review: { icon: Eye, color: 'bg-purple-500', label: 'Under Review' }
  };

  const getAvailableStatuses = (): GigStatus[] => {
    const isAdmin = (userRole as string) === 'admin';
    if (isAdmin) {
      return ['open', 'in_progress', 'completed', 'cancelled', 'disputed', 'under_review'];
    }
    
    switch (currentStatus) {
      case 'open':
        return userRole === 'employer' ? ['in_progress', 'cancelled'] : [];
      case 'assigned':
        return userRole === 'employer' ? ['in_progress', 'cancelled'] : [];
      case 'in_progress':
        return userRole === 'employer' ? ['completed', 'disputed'] : userRole === 'worker' ? ['completed'] : [];
      case 'completed':
        return [];
      case 'cancelled':
        return isAdmin ? ['open'] : [];
      case 'disputed':
        return isAdmin ? ['completed', 'cancelled', 'under_review'] : [];
      case 'under_review':
        return isAdmin ? ['completed', 'cancelled', 'open'] : [];
      default:
        return [];
    }
  };

  const handleStatusChange = async (newStatus: GigStatus) => {
    if (['cancelled', 'disputed'].includes(newStatus)) {
      setPendingStatus(newStatus);
      setShowReasonDialog(true);
      return;
    }
    
    await updateStatus(newStatus);
  };

  const updateStatus = async (newStatus: GigStatus, updateReason?: string) => {
    setUpdating(true);
    
    try {
      const { error } = await gigService.updateGigStatus(gigId, newStatus as any, undefined, updateReason || null);

      if (error) throw error;

      onStatusChange(newStatus);
      toast({ 
        title: 'Status Updated', 
        description: `Gig status changed to ${statusConfig[newStatus].label}` 
      });
      
      setShowReasonDialog(false);
      setReason('');
      setPendingStatus(null);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setUpdating(false);
    }
  };

  const confirmAs = async (role: 'provider' | 'worker') => {
    setUpdating(true);
    try {
      const { error, completed } = await gigService.confirmCompletion(gigId, role);
      if (error) throw error;
      if (completed) {
        const { error: payError } = await gigService.triggerPayment(gigId);
        if (payError) throw payError;
        onStatusChange('completed');
        toast({ title: 'Completion Confirmed', description: 'Payment has been initiated.' });
      } else {
        toast({ title: 'Confirmation Recorded', description: 'Waiting for the other party to confirm.' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };
  
  const startJob = async () => {
    setUpdating(true);
    try {
      const { error } = await gigService.lockJob(gigId);
      if (error) throw error;
      onStatusChange('in_progress');
      toast({ title: 'Job Started', description: 'The gig is now in progress.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };
  
  React.useEffect(() => {
    const loadTarget = async () => {
      if (currentStatus !== 'completed') {
        setTargetUserId(null);
        setPaymentStatus(null);
        return;
      }
      const { data, error } = await supabase
        .from('gigs')
        .select('client_id,worker_id')
        .eq('id', gigId)
        .single();
      if (error || !data) {
        setTargetUserId(null);
        setPaymentStatus(null);
        return;
      }
      const target = userRole === 'employer' ? data.worker_id : userRole === 'worker' ? data.client_id : null;
      setTargetUserId(target || null);
      const { payment } = await gigService.getPaymentByJobId(gigId);
      setPaymentStatus(payment?.status || null);
    };
    loadTarget();
  }, [currentStatus, gigId, userRole]);

  React.useEffect(() => {
    if (currentStatus !== 'completed') return;
    const channel = supabase.channel(`payments-job-${gigId}`);
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `jobId=eq.${gigId}` }, (payload: any) => {
      const next = (payload?.new && (payload.new as any).status) || (payload?.old && (payload.old as any).status);
      if (next) setPaymentStatus(next);
    });
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentStatus, gigId]);

  const StatusIcon = statusConfig[currentStatus].icon;
  const availableStatuses = getAvailableStatuses();

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="secondary" 
        className={`${statusConfig[currentStatus].color} text-white flex items-center gap-1`}
      >
        <StatusIcon className="w-3 h-3" />
        {statusConfig[currentStatus].label}
      </Badge>
      
      {availableStatuses.length > 0 && (
        <Select onValueChange={handleStatusChange} disabled={updating}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Change" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((status) => {
              const StatusIcon = statusConfig[status].icon;
              return (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig[status].label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}
      
      {currentStatus === 'assigned' && userRole === 'employer' && (
        <Button onClick={startJob} disabled={updating} variant="outline">
          {updating ? 'Starting...' : 'Start Job'}
        </Button>
      )}
      
      {currentStatus === 'in_progress' && (
        <>
          {userRole === 'employer' && (
            <Button onClick={() => confirmAs('provider')} disabled={updating} variant="outline">
              {updating ? 'Confirming...' : 'Confirm as Provider'}
            </Button>
          )}
          {userRole === 'worker' && (
            <Button onClick={() => confirmAs('worker')} disabled={updating} variant="outline">
              {updating ? 'Confirming...' : 'Confirm as Worker'}
            </Button>
          )}
        </>
      )}
      
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === 'cancelled' ? 'Cancel Gig' : 'Report Dispute'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={`Please provide a reason for ${pendingStatus === 'cancelled' ? 'cancelling' : 'disputing'} this gig...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => pendingStatus && updateStatus(pendingStatus, reason)}
                disabled={!reason.trim() || updating}
                className="flex-1"
              >
                {updating ? 'Updating...' : 'Confirm'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReasonDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {currentStatus === 'completed' && user && targetUserId && (
        <div className="mt-3 space-y-2">
          {userRole === 'employer' && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {paymentStatus ? `Payment: ${paymentStatus}` : 'Payment: none'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                disabled={updating || !!paymentStatus}
                onClick={async () => {
                  try {
                    setUpdating(true);
                    const { error } = await gigService.triggerPayment(gigId);
                    if (error) throw error;
                    const { payment } = await gigService.getPaymentByJobId(gigId);
                    setPaymentStatus(payment?.status || 'pending');
                    toast({ title: 'Payment Triggered', description: 'Payment record created.' });
                  } catch (error: any) {
                    toast({ title: 'Error', description: error.message, variant: 'destructive' });
                  } finally {
                    setUpdating(false);
                  }
                }}
              >
                Trigger Payment
              </Button>
            </div>
          )}
          <ReviewRatingSystem
            gigId={gigId}
            userId={user.id}
            targetUserId={targetUserId}
            userRole={userRole === 'employer' ? 'employer' : 'worker'}
            onReviewSubmitted={() => toast({ title: 'Review Submitted' })}
          />
        </div>
      )}
    </div>
  );
};

export default GigStatusManager;
