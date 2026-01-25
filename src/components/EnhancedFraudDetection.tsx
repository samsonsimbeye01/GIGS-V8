import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Ban, Users, CreditCard, FileText } from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'duplicate_account' | 'payment_anomaly' | 'fake_posting' | 'suspicious_behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId: string;
  evidence: string[];
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
}

interface FraudStats {
  totalAlerts: number;
  criticalAlerts: number;
  resolvedToday: number;
  preventedLoss: number;
}

const EnhancedFraudDetection: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [stats, setStats] = useState<FraudStats>({
    totalAlerts: 0,
    criticalAlerts: 0,
    resolvedToday: 0,
    preventedLoss: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFraudData();
    
    // Real-time fraud detection monitoring
    const channel = supabase
      .channel('fraud-detection')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => checkForFraud(payload)
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'gigs' },
        (payload) => checkGigFraud(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadFraudData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-fraud-detection', {
        body: { action: 'get_alerts' }
      });

      if (error) throw error;

      setAlerts(data.alerts || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Fraud detection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForFraud = async (payload: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-fraud-detection', {
        body: {
          action: 'analyze_user',
          userData: payload.new || payload.old,
          eventType: payload.eventType
        }
      });

      if (error) throw error;

      if (data.fraudDetected) {
        setAlerts(prev => [data.alert, ...prev]);
        setStats(prev => ({
          ...prev,
          totalAlerts: prev.totalAlerts + 1,
          criticalAlerts: data.alert.severity === 'critical' ? prev.criticalAlerts + 1 : prev.criticalAlerts
        }));
      }
    } catch (error) {
      console.error('Fraud check error:', error);
    }
  };

  const checkGigFraud = async (payload: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-fraud-detection', {
        body: {
          action: 'analyze_gig',
          gigData: payload.new || payload.old,
          eventType: payload.eventType
        }
      });

      if (error) throw error;

      if (data.fraudDetected) {
        setAlerts(prev => [data.alert, ...prev]);
      }
    } catch (error) {
      console.error('Gig fraud check error:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'duplicate_account': return <Users className="w-4 h-4" />;
      case 'payment_anomaly': return <CreditCard className="w-4 h-4" />;
      case 'fake_posting': return <FileText className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const resolveAlert = async (alertId: string, resolution: string) => {
    try {
      const { error } = await supabase.functions.invoke('ai-fraud-detection', {
        body: {
          action: 'resolve_alert',
          alertId,
          resolution
        }
      });

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
      
      setStats(prev => ({ ...prev, resolvedToday: prev.resolvedToday + 1 }));
    } catch (error) {
      console.error('Resolution error:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{stats.totalAlerts}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold text-green-500">{stats.resolvedToday}</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loss Prevented</p>
                <p className="text-2xl font-bold text-purple-500">${stats.preventedLoss.toLocaleString()}</p>
              </div>
              <Ban className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AI Fraud Detection Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  No fraud alerts detected. System is actively monitoring for suspicious activity.
                </AlertDescription>
              </Alert>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <h4 className="font-semibold">{alert.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          User ID: {alert.userId} • {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">Evidence:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {alert.evidence.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {alert.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id, 'false_positive')}
                      >
                        Mark as False Positive
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => resolveAlert(alert.id, 'confirmed')}
                      >
                        Investigate
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFraudDetection;