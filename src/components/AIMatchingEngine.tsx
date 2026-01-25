import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Shield, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface MatchScore {
  gigId: string;
  title: string;
  score: number;
  factors: {
    proximity: number;
    skillMatch: number;
    trustScore: number;
    priceMatch: number;
    availability: number;
  };
  reasons: string[];
}

interface AIMatchingEngineProps {
  userId: string;
  userLocation?: { lat: number; lng: number };
  userSkills?: string[];
  onMatchFound?: (matches: MatchScore[]) => void;
}

const AIMatchingEngine: React.FC<AIMatchingEngineProps> = ({
  userId,
  userLocation,
  userSkills = [],
  onMatchFound
}) => {
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trustScore, setTrustScore] = useState(85);
  const [matchingEnabled, setMatchingEnabled] = useState(true);

  useEffect(() => {
    if (matchingEnabled) {
      runMatchingEngine();
      const interval = setInterval(runMatchingEngine, 30000); // Run every 30 seconds
      return () => clearInterval(interval);
    }
  }, [matchingEnabled, userLocation, userSkills]);

  const runMatchingEngine = async () => {
    if (!userLocation) return;
    
    setIsAnalyzing(true);
    
    try {
      // Fetch available gigs
      const { data: gigs, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('status', 'open');

      if (error) throw error;

      // Calculate AI matching scores
      const scoredMatches = await Promise.all(
        (gigs || []).map(async (gig) => {
          const score = await calculateMatchScore(gig);
          return score;
        })
      );

      // Sort by score and take top matches
      const topMatches = scoredMatches
        .filter(match => match.score >= 60)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setMatches(topMatches);
      onMatchFound?.(topMatches);

      if (topMatches.length > 0) {
        toast({
          title: 'New AI Matches Found!',
          description: `Found ${topMatches.length} high-quality gig matches for you.`
        });
      }
    } catch (error) {
      console.error('Error running matching engine:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateMatchScore = async (gig: any): Promise<MatchScore> => {
    // Proximity score (0-100)
    const distance = calculateDistance(userLocation!, {
      lat: gig.latitude || 0,
      lng: gig.longitude || 0
    });
    const proximityScore = Math.max(0, 100 - (distance * 20)); // Decrease by 20 per km

    // Skill match score (0-100)
    const gigSkills = gig.required_skills || [];
    const skillMatchScore = calculateSkillMatch(userSkills, gigSkills);

    // Trust score compatibility (0-100)
    const trustCompatibility = Math.min(100, trustScore + 10);

    // Price match score (0-100)
    const priceMatchScore = calculatePriceMatch(gig.budget);

    // Availability score (0-100)
    const availabilityScore = calculateAvailability(gig.deadline);

    // Weighted total score
    const totalScore = Math.round(
      (proximityScore * 0.3) +
      (skillMatchScore * 0.25) +
      (trustCompatibility * 0.2) +
      (priceMatchScore * 0.15) +
      (availabilityScore * 0.1)
    );

    // Generate reasons for the match
    const reasons = generateMatchReasons({
      proximity: proximityScore,
      skillMatch: skillMatchScore,
      trustScore: trustCompatibility,
      priceMatch: priceMatchScore,
      availability: availabilityScore
    });

    return {
      gigId: gig.id,
      title: gig.title,
      score: totalScore,
      factors: {
        proximity: proximityScore,
        skillMatch: skillMatchScore,
        trustScore: trustCompatibility,
        priceMatch: priceMatchScore,
        availability: availabilityScore
      },
      reasons
    };
  };

  const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }) => {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateSkillMatch = (userSkills: string[], gigSkills: string[]) => {
    if (gigSkills.length === 0) return 70; // Default score if no skills specified
    
    const matchingSkills = userSkills.filter(skill => 
      gigSkills.some(gigSkill => 
        gigSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(gigSkill.toLowerCase())
      )
    );
    
    return Math.min(100, (matchingSkills.length / gigSkills.length) * 100);
  };

  const calculatePriceMatch = (budget: number) => {
    // Mock user's preferred price range
    const userMinPrice = 10000;
    const userMaxPrice = 100000;
    
    if (budget >= userMinPrice && budget <= userMaxPrice) {
      return 100;
    } else if (budget < userMinPrice) {
      return Math.max(0, 100 - ((userMinPrice - budget) / userMinPrice) * 100);
    } else {
      return Math.max(0, 100 - ((budget - userMaxPrice) / userMaxPrice) * 50);
    }
  };

  const calculateAvailability = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDeadline <= 0) return 0;
    if (daysUntilDeadline >= 7) return 100;
    return Math.max(0, (daysUntilDeadline / 7) * 100);
  };

  const generateMatchReasons = (factors: MatchScore['factors']) => {
    const reasons: string[] = [];
    
    if (factors.proximity >= 80) reasons.push('Very close to your location');
    if (factors.skillMatch >= 80) reasons.push('Perfect skill match');
    if (factors.trustScore >= 80) reasons.push('High trust compatibility');
    if (factors.priceMatch >= 80) reasons.push('Great price match');
    if (factors.availability >= 80) reasons.push('Flexible timeline');
    
    return reasons;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Matching Engine
          {isAnalyzing && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Trust Score: {trustScore}%</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMatchingEnabled(!matchingEnabled)}
          >
            {matchingEnabled ? 'Disable' : 'Enable'} AI Matching
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <p>No AI matches found yet</p>
            <p className="text-sm">Enable location and add skills for better matches</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div key={match.gigId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{match.title}</h4>
                  <Badge variant={getScoreBadgeVariant(match.score)}>
                    <Star className="w-3 h-3 mr-1" />
                    {match.score}% Match
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Proximity:</span>
                    <span className={getScoreColor(match.factors.proximity)}>
                      {match.factors.proximity}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills:</span>
                    <span className={getScoreColor(match.factors.skillMatch)}>
                      {match.factors.skillMatch}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trust:</span>
                    <span className={getScoreColor(match.factors.trustScore)}>
                      {match.factors.trustScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className={getScoreColor(match.factors.priceMatch)}>
                      {match.factors.priceMatch}%
                    </span>
                  </div>
                </div>
                
                <Progress value={match.score} className="h-2" />
                
                {match.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {match.reasons.map((reason, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchingEngine;