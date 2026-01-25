import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Eye, Ban } from 'lucide-react';

interface ModerationResult {
  id: string;
  content: string;
  flagged: boolean;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

const EnhancedContentModerator: React.FC = () => {
  const [moderationResults, setModerationResults] = useState<ModerationResult[]>([]);
  const [stats, setStats] = useState({ flagged: 0, reviewed: 0, blocked: 0 });

  useEffect(() => {
    // Real-time moderation monitoring
    const channel = supabase
      .channel('moderation')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'gigs' },
        async (payload) => {
          await moderateContent(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const moderateContent = async (content: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-moderation', {
        body: {
          content: content.description,
          title: content.title,
          category: content.category,
          userId: content.user_id
        }
      });

      if (error) throw error;

      if (data.flagged) {
        setModerationResults(prev => [{
          id: content.id,
          content: content.title,
          flagged: data.flagged,
          reason: data.reason,
          severity: data.severity,
          timestamp: new Date().toISOString()
        }, ...prev.slice(0, 9)]);

        setStats(prev => ({ ...prev, flagged: prev.flagged + 1 }));
      }
    } catch (error) {
      console.error('Moderation error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold text-red-500">{stats.flagged}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.reviewed}</p>
              </div>
              <Eye className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-gray-500">{stats.blocked}</p>
              </div>
              <Ban className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AI Content Moderation - Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moderationResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{result.content}</p>
                  <p className="text-sm text-muted-foreground">{result.reason}</p>
                  <p className="text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleString()}</p>
                </div>
                <Badge variant={result.severity === 'high' ? 'destructive' : result.severity === 'medium' ? 'default' : 'secondary'}>
                  {result.severity}
                </Badge>
              </div>
            ))}
            {moderationResults.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No flagged content detected</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedContentModerator;