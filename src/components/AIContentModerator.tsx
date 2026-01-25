import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ModerationResult {
  flagged: boolean;
  reasons: string[];
  riskScore: number;
  action: 'approve' | 'review';
}

interface AIContentModeratorProps {
  onModerationResult?: (result: ModerationResult) => void;
}

const AIContentModerator: React.FC<AIContentModeratorProps> = ({ onModerationResult }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ModerationResult | null>(null);

  const moderateContent = async () => {
    if (!content.trim()) {
      toast({ title: 'Error', description: 'Please enter content to moderate' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-moderation', {
        body: {
          content: content.trim(),
          type: 'gig_description',
          userId: 'current-user-id'
        }
      });

      if (error) throw error;

      setResult(data);
      onModerationResult?.(data);

      toast({
        title: data.flagged ? 'Content Flagged' : 'Content Approved',
        description: data.flagged 
          ? `Risk Score: ${data.riskScore}% - Requires review`
          : 'Content passed AI moderation checks'
      });
    } catch (error) {
      console.error('Moderation error:', error);
      toast({ title: 'Error', description: 'Failed to moderate content' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          AI Content Moderation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter gig description or content to moderate..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        
        <Button 
          onClick={moderateContent} 
          disabled={loading || !content.trim()}
          className="w-full"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
          ) : (
            <><Shield className="w-4 h-4 mr-2" />Moderate Content</>
          )}
        </Button>

        {result && (
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.flagged ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <span className="font-medium">
                  {result.flagged ? 'Content Flagged' : 'Content Approved'}
                </span>
              </div>
              <Badge variant={result.flagged ? 'destructive' : 'default'}>
                Risk: {result.riskScore}%
              </Badge>
            </div>
            
            {result.reasons.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Flagged Reasons:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Recommended Action:</span>
              <Badge variant={result.action === 'review' ? 'secondary' : 'default'}>
                {result.action === 'review' ? 'Manual Review' : 'Auto Approve'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIContentModerator;