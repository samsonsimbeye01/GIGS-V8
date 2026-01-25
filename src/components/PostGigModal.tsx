import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import JobCategorySelector from './JobCategorySelector';
import JobTypeSelector from './JobTypeSelector';
import { jobCategories } from '@/utils/jobCategories';

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const PostGigModal: React.FC<PostGigModalProps> = ({ isOpen, onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('normal');

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setJobType(''); // Reset job type when category changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({ title: 'Please sign in to post a gig', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    try {
      const categoryData = jobCategories[category as keyof typeof jobCategories];
      const { data, error } = await supabase
        .from('gigs')
        .insert({
          title,
          description,
          category: categoryData?.name || category,
          job_type: jobType,
          budget: parseFloat(budget),
          location,
          urgency,
          poster_id: userId,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({ title: 'Gig posted successfully!' });
      onClose();
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setJobType('');
      setBudget('');
      setLocation('');
      setUrgency('normal');
    } catch (error: any) {
      console.error('Error posting gig:', error);
      toast({ title: 'Error posting gig', description: 'Please try again later', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-primary">Post a New Gig</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Gig Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Need experienced mason for wall construction"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Job Category</Label>
            <JobCategorySelector
              value={category}
              onValueChange={handleCategoryChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="jobType">Specific Job Type</Label>
            <JobTypeSelector
              categoryKey={category}
              value={jobType}
              onValueChange={setJobType}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need help with in detail..."
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="50"
                min="1"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Area or Address"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-secondary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Gig'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostGigModal;