import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, MapPin, Clock, DollarSign, TrendingUp, Target, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MatchedGig {
  id: string;
  title: string;
  location: { lat: number; lng: number };
  requiredSkills: string[];
  budget: number;
  urgency: string;
  category: string;
  matchScore: number;
  distance: number;
  reasons: string[];
}

interface MarketInsights {
  totalMatches: number;
  averageScore: number;
  recommendations: string[];
  marketTrends: {
    demandingSkills: string[];
    peakHours: string[];
    averageRates: Record<string, number>;
  };
}

const AISmartMatching: React.FC = () => {
  const [matches, setMatches] = useState<MatchedGig[]>([]);
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGig, setSelectedGig] = useState<string | null>(null);
  const { country } = useLocation();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-smart-matching', {
        body: {
          userId: 'current-user-id',
          userProfile: {
            location: { lat: -1.2921, lng: 36.8219 },
            skills: ['cleaning', 'delivery', 'handyman'],
            trustScore: 85,
            minRate: 500,
            maxRate: 5000,
            completionRate: 92,
            responseTime: 15
          },
          matchType: 'gigs'
        }
      });

      if (error) throw error;

      setMatches(data.matches);
      setInsights(data.insights);
      
      toast({
        title: 'Smart Matches Updated',
        description: `Found ${data.matches.length} personalized gig matches`
      });
    } catch (error) {
      console.error('Matching error:', error);
      toast({ title: 'Error', description: 'Failed to fetch smart matches' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${country.currency}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            AI Smart Matching
          </h2>
          <p className="text-muted-foreground">Personalized gig recommendations powered by AI</p>
        </div>
        <Button onClick={fetchMatches} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
          Refresh Matches
        </Button>
      </div>

      {/* Market Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{insights.totalMatches}</p>
                <p className="text-sm text-muted-foreground">Available Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{Math.round(insights.averageScore)}%</p>
                <p className="text-sm text-muted-foreground">Avg Match Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{insights.marketTrends.demandingSkills.length}</p>
                <p className="text-sm text-muted-foreground">Hot Skills</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium mb-2">AI Recommendations:</p>
                <ul className="text-sm space-y-1">
                  {insights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-2">Peak Hours:</p>
                <div className="flex flex-wrap gap-2">
                  {insights.marketTrends.peakHours.map((hour, index) => (
                    <Badge key={index} variant="outline">{hour}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matched Gigs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Personalized Matches</h3>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((gig) => (
              <Card key={gig.id} className={`cursor-pointer transition-all ${
                selectedGig === gig.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`} onClick={() => setSelectedGig(selectedGig === gig.id ? null : gig.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{gig.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {gig.distance.toFixed(1)} km away
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(gig.budget)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={gig.matchScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{Math.round(gig.matchScore)}%</span>
                      </div>
                      <Badge variant={getUrgencyColor(gig.urgency)} className="text-xs">
                        {gig.urgency} priority
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {gig.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {selectedGig === gig.id && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-2">Why this matches you:</p>
                      <ul className="text-sm space-y-1">
                        {gig.reasons.map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1">
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline">
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISmartMatching;