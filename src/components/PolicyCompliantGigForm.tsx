import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import PolicyCompliantContentModerator from './PolicyCompliantContentModerator';
import { supabase } from '@/lib/supabase';
import { PolicyComplianceService } from '@/services/policyComplianceService';

interface PolicyCompliantGigFormProps {
  onGigCreated?: (gig: any) => void;
  onClose?: () => void;
}

export const PolicyCompliantGigForm: React.FC<PolicyCompliantGigFormProps> = ({
  onGigCreated,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    duration: ''
  });
  const [isContentValid, setIsContentValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isContentValid) {
      setError('Content violates Google Play policies. Please revise.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Additional policy checks
      const titleCheck = await PolicyComplianceService.validateContent(formData.title, 'gig');
      const descCheck = await PolicyComplianceService.validateContent(formData.description, 'gig');
      
      if (!titleCheck.isValid || !descCheck.isValid) {
        setError('Content contains policy violations and cannot be posted.');
        return;
      }

      // Check for age-appropriate content
      if (!PolicyComplianceService.validateAgeAppropriate(formData.description)) {
        setError('Content is not appropriate for all ages.');
        return;
      }

      // Check for financial services compliance
      if (!PolicyComplianceService.validateFinancialContent(formData.description)) {
        setError('Financial services content requires additional verification.');
        return;
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setError('You must be signed in to post a gig.');
        return;
      }

      // Log data usage for compliance
      await PolicyComplianceService.logDataAccess(
        user.user.id,
        'gig_creation',
        'user_posted_new_gig'
      );

      const { data: gig, error: gigError } = await supabase
        .from('gigs')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.budget),
          location: formData.location,
          duration: formData.duration,
          user_id: user.user.id,
          status: 'open',
          policy_compliant: true,
          content_moderated: true
        })
        .select()
        .single();

      if (gigError) throw gigError;
      
      onGigCreated?.(gig);
      onClose?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  const fullContent = `${formData.title} ${formData.description}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium">Google Play Policy Compliant</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Gig Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter gig title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the work needed"
          rows={4}
          required
        />
      </div>

      <PolicyCompliantContentModerator
        content={fullContent}
        contentType="gig"
        onValidationChange={setIsContentValid}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !isContentValid} className="flex-1">
          {loading ? 'Creating...' : 'Post Gig'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PolicyCompliantGigForm;