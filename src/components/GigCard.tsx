import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ShieldCheck, Star, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface GigCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  feePercent: number;
  timeAgo: string;
  category: string;
  distance: string;
  poster: string;
  urgency: 'low' | 'medium' | 'high';
  trustLevel: 1 | 2 | 3 | 4 | 5;
  rating: number;
  completionRate: number;
  responseTime: string;
  disputeRate: number;
  sentimentScore: number;
  views: number;
  highDemand: boolean;
  suspiciousAccount: boolean;
  featured?: boolean;
  expectedImpressions?: number;
}

const trustLabels: Record<GigCardProps['trustLevel'], string> = {
  1: 'Trust L1 • Email verified',
  2: 'Trust L2 • Phone verified',
  3: 'Trust L3 • Government ID',
  4: 'Trust L4 • Address confirmed',
  5: 'Trust L5 • Professional certified'
};

const GigCard: React.FC<GigCardProps> = ({
  title,
  description,
  location,
  budget,
  feePercent,
  timeAgo,
  category,
  distance,
  poster,
  urgency,
  trustLevel,
  rating,
  completionRate,
  responseTime,
  disputeRate,
  sentimentScore,
  views,
  highDemand,
  suspiciousAccount,
  featured = false,
  expectedImpressions = 120
}) => {
  const [boosted, setBoosted] = useState(featured);

  const feeAmount = useMemo(() => Math.round((budget * feePercent) / 100), [budget, feePercent]);
  const payout = budget - feeAmount;

  const urgencyClasses = {
    low: 'bg-[rgb(var(--secondary-300))] text-[rgb(var(--foreground))]',
    medium: 'bg-[rgb(var(--warning))]/15 text-[rgb(var(--warning))]',
    high: 'bg-[rgb(var(--destructive))]/15 text-[rgb(var(--destructive))]'
  };

  return (
    <Card
      className={`rounded-[var(--radius)] border transition-all duration-200 ${
        boosted ? 'border-[rgb(var(--accent))] shadow-[0_0_0_1px_rgba(245,166,35,0.35),0_12px_30px_rgba(30,42,120,0.12)]' : 'border-[rgb(var(--border))]'
      }`}
    >
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="heading-h3 text-[rgb(var(--foreground))]">{title}</CardTitle>
            <p className="text-small text-[rgb(var(--muted-foreground))]">Posted by {poster}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {boosted && (
              <Badge className="rounded-full bg-[rgb(var(--accent))] text-[rgb(var(--foreground))]">Featured</Badge>
            )}
            <Badge className={urgencyClasses[urgency]}>{urgency} priority</Badge>
          </div>
        </div>

        {suspiciousAccount && (
          <div className="rounded-xl border border-[rgb(var(--warning))]/50 bg-[rgb(var(--warning))]/10 p-3 text-small text-[rgb(var(--foreground))] flex gap-2 items-start">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-[rgb(var(--warning))]" />
            <span>Safety check: This profile is newly created. Review trust signals before accepting.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-[rgb(var(--primary-100))] text-[rgb(var(--primary))]">{category}</Badge>
          <Badge variant="outline" className="border-[rgb(var(--secondary))] text-[rgb(var(--foreground))]">
            <ShieldCheck className="h-3 w-3 mr-1" />
            {trustLabels[trustLevel]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-small text-[rgb(var(--muted-foreground))]">{description}</p>

        <div className="grid grid-cols-2 gap-2 text-caption text-[rgb(var(--muted-foreground))]">
          <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {location} • {distance}</div>
          <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {timeAgo}</div>
          <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-[rgb(var(--accent))]" /> {rating.toFixed(1)} rating</div>
          <div className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {completionRate}% completion</div>
          <div>Response: {responseTime}</div>
          <div>Disputes: {disputeRate}%</div>
          <div>Sentiment: {sentimentScore}/100</div>
          <div>{views} people viewed this gig</div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--muted))] p-3">
          <div className="flex items-center justify-between text-small"><span>Gig budget</span><span className="font-semibold">TZS {budget.toLocaleString()}</span></div>
          <div className="flex items-center justify-between text-small"><span>Platform fee ({feePercent}%)</span><span className="font-semibold">TZS {feeAmount.toLocaleString()}</span></div>
          <div className="mt-1 flex items-center justify-between text-small"><span>You receive</span><span className="font-semibold text-[rgb(var(--success))]">TZS {payout.toLocaleString()}</span></div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary-100))] p-3 text-small text-[rgb(var(--foreground))] flex items-center justify-between">
          <div>
            <p className="font-medium">Boosted listing</p>
            <p className="text-caption text-[rgb(var(--muted-foreground))]">Expected impressions: ~{expectedImpressions.toLocaleString()}</p>
          </div>
          <Button
            type="button"
            variant={boosted ? 'secondary' : 'default'}
            onClick={() => setBoosted((prev) => !prev)}
            className={boosted ? '' : 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-500))]'}
          >
            <Zap className="h-4 w-4 mr-1" />
            {boosted ? 'Boost on' : 'Boost'}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2">
          {highDemand ? (
            <p className="text-caption text-[rgb(var(--secondary))] font-medium">High demand category</p>
          ) : (
            <p className="text-caption text-[rgb(var(--muted-foreground))]">Verified users get faster responses.</p>
          )}
          <Button className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-500))] text-white">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GigCard;
