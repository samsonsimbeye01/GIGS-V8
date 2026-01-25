import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Shield, Globe, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 empowered-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary">
                Linka
              </h1>
            </div>
            <Badge variant="outline" className="mb-6 text-sm px-4 py-1">
              🌍 linka.today - Official Domain
            </Badge>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with real-time gigs in East Africa. Your hustle, empowered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Find Gigs Now
              </Button>
              <Button size="lg" variant="outline">
                Post a Gig
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Linka?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              East Africa's most trusted platform for real-time gig work
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
                <p className="text-muted-foreground">
                  Find gigs within 1-5km radius. Work close to home.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
                <p className="text-muted-foreground">
                  AI-powered verification and trust scoring system.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">East Africa Focus</h3>
                <p className="text-muted-foreground">
                  Tailored for East African markets with local payment integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-primary-foreground/80">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">25K+</div>
              <div className="text-primary-foreground/80">Gigs Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-primary-foreground/80">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">6+</div>
              <div className="text-primary-foreground/80">East African Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-secondary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Hustle?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of workers and employers connecting daily across East Africa
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Get Started on linka.today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;