import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Target, TrendingUp } from 'lucide-react';

interface RecommendedGig {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  distance: number;
  payment: number;
  currency: string;
  postedAt: string;
  matchScore: number;
  skills: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface AIJobRecommendationEngineProps {
  userId?: string;
}

const AIJobRecommendationEngine: React.FC<AIJobRecommendationEngineProps> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<RecommendedGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const { country, coordinates } = useLocation();

  useEffect(() => {
    loadRecommendations();
    
    // Real-time updates for new gigs
    const channel = supabase
      .channel('gig-recommendations')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gigs' },
        () => loadRecommendations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, coordinates]);

  const loadRecommendations = async () => {
    if (!coordinates) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-smart-matching', {
        body: {
          userId,
          location: coordinates,
          country: country.code,
          preferences: userPreferences
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
      setUserPreferences(data.userProfile);
    } catch (error) {
      console.error('Recommendation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Job Recommendations
            <Badge variant="secondary">{recommendations.length} matches</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No personalized recommendations yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Complete more gigs to improve AI matching.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recommendations.map((gig) => (
            <Card key={gig.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{gig.title}</h3>
                      <div className={`w-2 h-2 rounded-full ${getUrgencyColor(gig.urgency)}`}></div>
                      <Badge variant="outline" className={getMatchScoreColor(gig.matchScore)}>
                        {gig.matchScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{gig.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {gig.location} ({gig.distance.toFixed(1)}km)
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {gig.payment.toLocaleString()} {gig.currency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(gig.postedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {gig.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {gig.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{gig.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIJobRecommendationEngine;