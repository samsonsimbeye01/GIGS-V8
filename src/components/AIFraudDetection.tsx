import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Activity } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FraudAnalysis {
  userId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
  recommendedAction: string;
  securityRecommendations: string[];
  trustScoreImpact: number;
  analysis: {
    accountHealth: number;
    behaviorPattern: string;
    requiresIntervention: boolean;
  };
}

const AIFraudDetection: React.FC = () => {
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const analyzeActivity = async (activityType: string, activityData?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-fraud-detection', {
        body: {
          userId: 'current-user-id',
          activityType,
          activityData,
          userHistory: {
            accountAge: 45,
            gigsPostedToday: 2,
            loginLocations: ['Nairobi', 'Mombasa'],
            averageTransaction: 2500,
            failedPayments: 1,
            profileChangesToday: 0,
            completionRate: 85,
            totalGigs: 23,
            trustScore: 78
          }
        }
      });

      if (error) throw error;

      setAnalysis(data);
      
      // Add to recent activities
      setRecentActivities(prev => [{
        type: activityType,
        timestamp: new Date(),
        riskScore: data.riskScore,
        action: data.recommendedAction
      }, ...prev.slice(0, 9)]);

      if (data.riskScore > 60) {
        toast({
          title: 'High Risk Activity Detected',
          description: `Risk Score: ${data.riskScore}% - ${data.recommendedAction}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Fraud detection error:', error);
      toast({ title: 'Error', description: 'Failed to analyze activity' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simulate initial analysis
    analyzeActivity('login');
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'block': return <Lock className="w-4 h-4 text-red-500" />;
      case 'review': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'monitor': return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            AI Fraud Detection
          </h2>
          <p className="text-muted-foreground">Real-time security monitoring and threat analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={monitoringActive ? 'default' : 'secondary'}>
            {monitoringActive ? 'Active' : 'Paused'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMonitoringActive(!monitoringActive)}
          >
            {monitoringActive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Current Analysis */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Risk Assessment</span>
              <Badge variant={getRiskBadgeVariant(analysis.riskLevel)}>
                {analysis.riskLevel.toUpperCase()} RISK
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskScore}%
                </div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <Progress value={analysis.riskScore} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.analysis.accountHealth}%
                </div>
                <p className="text-sm text-muted-foreground">Account Health</p>
                <Progress value={analysis.analysis.accountHealth} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analysis.flags.length}
                </div>
                <p className="text-sm text-muted-foreground">Active Flags</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Flags
                </h4>
                {analysis.flags.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.flags.map((flag, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No risk flags detected</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Recommendations
                </h4>
                {analysis.securityRecommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.securityRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No additional security measures needed</p>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getActionIcon(analysis.recommendedAction)}
                  <span className="font-medium">Recommended Action:</span>
                  <Badge variant="outline">{analysis.recommendedAction.toUpperCase()}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Behavior: {analysis.analysis.behaviorPattern}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Test Fraud Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => analyzeActivity('login')}
              disabled={loading}
            >
              Login Activity
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => analyzeActivity('payment', { amount: 10000 })}
              disabled={loading}
            >
              Large Payment
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => analyzeActivity('gig_post')}
              disabled={loading}
            >
              Gig Posting
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => analyzeActivity('message', { content: 'Easy money guaranteed!' })}
              disabled={loading}
            >
              Suspicious Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(activity.action)}
                    <div>
                      <p className="font-medium">{activity.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.riskScore > 60 ? 'destructive' : activity.riskScore > 30 ? 'secondary' : 'default'}>
                      {activity.riskScore}% risk
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent security events</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFraudDetection;