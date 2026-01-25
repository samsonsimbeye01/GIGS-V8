import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Wand2, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/contexts/LocationContext';

const VoiceGigPosting: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [gigTitle, setGigTitle] = useState('');
  const [gigDescription, setGigDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const { country, formatPhoneNumber } = useLocation();

  const startRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      const mockTranscription = 'I need someone to clean my house in Westlands area. It\'s a 3 bedroom apartment and should take about 4 hours. I can pay around 2000 shillings.';
      setTranscription(mockTranscription);
      setIsRecording(false);
      generateAISuggestions(mockTranscription);
      toast({ title: 'Voice Recorded', description: 'Transcription complete!' });
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const generateAISuggestions = (text: string) => {
    // AI-powered suggestions based on transcription
    const suggestions = [
      'House Cleaning Service in Westlands',
      'Professional Apartment Cleaning',
      'Residential Cleaning - 3 Bedroom'
    ];
    setAiSuggestions(suggestions);
    
    // Auto-fill fields
    setGigTitle('House Cleaning Service in Westlands');
    setGigDescription('Professional cleaning service needed for a 3-bedroom apartment in Westlands area. Estimated duration: 4 hours. Must be thorough and reliable.');
    setBudget('2000');
  };

  const enhanceWithAI = () => {
    const enhanced = `${gigDescription}\n\nRequirements:\n- Bring own cleaning supplies\n- Previous experience preferred\n- Must be available on weekends\n- References required`;
    setGigDescription(enhanced);
    toast({ title: 'AI Enhanced', description: 'Gig description improved with AI suggestions' });
  };

  const postGig = () => {
    if (!gigTitle || !gigDescription || !budget) {
      toast({ title: 'Error', description: 'Please fill all required fields' });
      return;
    }
    
    toast({ 
      title: 'Gig Posted Successfully!', 
      description: `Your gig "${gigTitle}" is now live and visible to workers in your area.` 
    });
    
    // Reset form
    setGigTitle('');
    setGigDescription('');
    setBudget('');
    setTranscription('');
    setAiSuggestions([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice-to-Text Gig Posting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Recording */}
          <div className="text-center space-y-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'destructive' : 'default'}
              size="lg"
              className="w-32 h-32 rounded-full"
            >
              {isRecording ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording your gig description'}
            </p>
          </div>

          {/* Transcription */}
          {transcription && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Transcription:</h4>
              <p className="text-sm">{transcription}</p>
            </div>
          )}

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">AI Title Suggestions:</h4>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setGigTitle(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gig Form */}
      <Card>
        <CardHeader>
          <CardTitle>Gig Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Gig Title *</label>
            <Input
              value={gigTitle}
              onChange={(e) => setGigTitle(e.target.value)}
              placeholder="Enter gig title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center justify-between">
              Description *
              <Button
                variant="ghost"
                size="sm"
                onClick={enhanceWithAI}
                disabled={!gigDescription}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                AI Enhance
              </Button>
            </label>
            <Textarea
              value={gigDescription}
              onChange={(e) => setGigDescription(e.target.value)}
              placeholder="Describe what you need done..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Budget ({country.currency}) *</label>
              <Input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0"
                type="number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <div className="flex items-center gap-2 p-2 border rounded">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{country.name}</span>
              </div>
            </div>
          </div>

          <Button onClick={postGig} className="w-full" size="lg">
            <Send className="w-4 h-4 mr-2" />
            Post Gig
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGigPosting;