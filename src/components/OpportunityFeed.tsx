import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, Clock, Users, Eye, Heart, Search, Plus, Phone, Mail } from 'lucide-react';
import { OpportunityQuestionnaire } from './OpportunityQuestionnaire';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  opportunityType: string;
  industry: string;
  investmentRange: { min: string; max: string };
  skillsRequired: string[];
  experienceLevel: string;
  timeCommitment: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  views: number;
  interested: number;
  createdAt: string;
  verified: boolean;
}

export const OpportunityFeed: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [contactOpp, setContactOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockOpportunities: Opportunity[] = [
      {
        id: '1',
        title: 'Mobile Money Agent Partnership',
        description: 'Looking for partners to establish mobile money kiosks in busy market areas. High foot traffic location secured. Training and initial stock provided.',
        location: 'Nakuru, Kenya',
        opportunityType: 'business',
        industry: 'services',
        investmentRange: { min: '50000', max: '100000' },
        skillsRequired: ['Customer Service', 'Finance'],
        experienceLevel: 'beginner',
        timeCommitment: 'Full-time',
        contactInfo: { name: 'James Mwangi', phone: '+254712345678', email: 'james@email.com' },
        views: 234,
        interested: 12,
        createdAt: '2024-01-15',
        verified: true
      },
      {
        id: '2',
        title: 'Organic Vegetable Farming Venture',
        description: 'Joint venture opportunity for organic farming. Land available, seeking investment partner for seeds, equipment, and marketing. Expected ROI 40% annually.',
        location: 'Mbeya, Tanzania',
        opportunityType: 'venture',
        industry: 'agriculture',
        investmentRange: { min: '200000', max: '500000' },
        skillsRequired: ['Agriculture', 'Marketing'],
        experienceLevel: 'intermediate',
        timeCommitment: 'Part-time',
        contactInfo: { name: 'Grace Mollel', phone: '+255789123456', email: 'grace@email.com' },
        views: 156,
        interested: 8,
        createdAt: '2024-01-14',
        verified: true
      }
    ];
    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('opportunity_interests');
      if (saved) {
        const interestedIds = JSON.parse(saved) as Record<string, boolean>;
        setOpportunities(prev =>
          prev.map(o => (interestedIds[o.id] ? { ...o, interested: o.interested + 1 } : o))
        );
      }
    } catch {}
  }, []);

  const handleSubmitOpportunity = (data: any) => {
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      ...data,
      investmentRange: { min: data.investmentMin, max: data.investmentMax },
      views: 0,
      interested: 0,
      createdAt: new Date().toISOString().split('T')[0],
      verified: false
    };
    setOpportunities(prev => [newOpportunity, ...prev]);
    setShowQuestionnaire(false);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || opp.opportunityType === typeFilter;
    const matchesIndustry = industryFilter === 'all' || opp.industry === industryFilter;
    
    return matchesSearch && matchesType && matchesIndustry;
  });

  const inferCurrency = (location: string): string => {
    if (location.toLowerCase().includes('kenya')) return 'KES';
    if (location.toLowerCase().includes('tanzania')) return 'TZS';
    if (location.toLowerCase().includes('uganda')) return 'UGX';
    return 'USD';
  };

  if (showQuestionnaire) {
    return (
      <OpportunityQuestionnaire
        onSubmit={handleSubmitOpportunity}
        onCancel={() => setShowQuestionnaire(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Local Business Opportunities</h2>
        <Button onClick={() => setShowQuestionnaire(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Share Opportunity
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="business">Business Partnership</SelectItem>
            <SelectItem value="venture">Investment Venture</SelectItem>
            <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
            <SelectItem value="gig">Gig/Contract</SelectItem>
          </SelectContent>
        </Select>

        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="transport">Transportation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map(opportunity => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                <div className="flex gap-2">
                  {opportunity.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {opportunity.opportunityType}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {opportunity.location}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {opportunity.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {opportunity.interested}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {opportunity.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {opportunity.skillsRequired.slice(0, 3).map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {opportunity.skillsRequired.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{opportunity.skillsRequired.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatCurrency(parseFloat(opportunity.investmentRange.min), inferCurrency(opportunity.location))}
                    {' - '}
                    {formatCurrency(parseFloat(opportunity.investmentRange.max), inferCurrency(opportunity.location))}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{opportunity.timeCommitment}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem('opportunity_interests');
                      const data = saved ? JSON.parse(saved) : {};
                      if (data[opportunity.id]) {
                        toast({ title: 'Already Interested', description: 'You have already shown interest.' });
                        return;
                      }
                      data[opportunity.id] = true;
                      localStorage.setItem('opportunity_interests', JSON.stringify(data));
                      setOpportunities(prev =>
                        prev.map(o => (o.id === opportunity.id ? { ...o, interested: o.interested + 1 } : o))
                      );
                      toast({ title: 'Interest Recorded', description: 'We will notify the owner.' });
                    } catch {}
                  }}
                >
                  Show Interest
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                  onClick={() => setContactOpp(opportunity)}
                >
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No opportunities found matching your criteria.</p>
        </div>
      )}

      <Dialog open={!!contactOpp} onOpenChange={() => setContactOpp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
          </DialogHeader>
          {contactOpp && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{contactOpp.contactInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${contactOpp.contactInfo.phone}`} className="text-primary hover:underline">
                  {contactOpp.contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${contactOpp.contactInfo.email}`} className="text-primary hover:underline">
                  {contactOpp.contactInfo.email}
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
