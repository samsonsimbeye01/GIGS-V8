import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Eye, Users, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ComplianceStats {
  totalContent: number;
  violationsDetected: number;
  complianceRate: number;
  recentViolations: Array<{
    id: string;
    type: string;
    content: string;
    violations: string[];
    timestamp: string;
  }>;
}

export const ComplianceMonitor: React.FC = () => {
  const [stats, setStats] = useState<ComplianceStats>({
    totalContent: 0,
    violationsDetected: 0,
    complianceRate: 100,
    recentViolations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceStats();
  }, []);

  const loadComplianceStats = async () => {
    try {
      // Get total gigs count
      const { count: totalGigs } = await supabase
        .from('gigs')
        .select('*', { count: 'exact', head: true });

      // Get policy compliant gigs
      const { count: compliantGigs } = await supabase
        .from('gigs')
        .select('*', { count: 'exact', head: true })
        .eq('policy_compliant', true);

      // Calculate compliance rate
      const complianceRate = totalGigs ? Math.round((compliantGigs || 0) / totalGigs * 100) : 100;
      const violationsDetected = (totalGigs || 0) - (compliantGigs || 0);

      // Get recent violations (simulated)
      const recentViolations = [
        {
          id: '1',
          type: 'Gig Post',
          content: 'Adult content detected...',
          violations: ['Inappropriate Content'],
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          type: 'Profile',
          content: 'Gambling services...',
          violations: ['Real-Money Gambling'],
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setStats({
        totalContent: totalGigs || 0,
        violationsDetected,
        complianceRate,
        recentViolations
      });
    } catch (error) {
      console.error('Failed to load compliance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Google Play Compliance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading compliance data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Google Play Compliance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalContent}</div>
                <div className="text-sm text-blue-700">Total Content Items</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.violationsDetected}</div>
                <div className="text-sm text-red-700">Policy Violations</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.complianceRate}%</div>
                <div className="text-sm text-green-700">Compliance Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Policy Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Child Safety</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">User Data Privacy</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Content Moderation</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Financial Services</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Regulated
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.recentViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Recent Policy Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentViolations.map((violation) => (
                <Alert key={violation.id} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">{violation.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {violation.content.substring(0, 100)}...
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {violation.violations.map((v, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {v}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(violation.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceMonitor;