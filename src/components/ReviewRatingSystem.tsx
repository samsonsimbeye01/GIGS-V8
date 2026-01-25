import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  gig_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar?: string;
}

type SupabaseReviewRow = {
  id: string;
  gig_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: {
    full_name?: string;
    avatar_url?: string;
  };
};

interface ReviewRatingSystemProps {
  gigId: string;
  userId: string;
  targetUserId: string;
  userRole: 'worker' | 'employer';
  onReviewSubmitted?: () => void;
}

const ReviewRatingSystem: React.FC<ReviewRatingSystemProps> = ({
  gigId,
  userId,
  targetUserId,
  userRole,
  onReviewSubmitted
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:user_profiles!reviewer_id(
            full_name,
            avatar_url
          )
        `)
        .eq('gig_id', gigId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = (data || []) as SupabaseReviewRow[];
      const formattedReviews = rows.map((review) => ({
        ...review,
        reviewer_name: review.reviewer?.full_name || 'Anonymous',
        reviewer_avatar: review.reviewer?.avatar_url
      })) || [];

      setReviews(formattedReviews);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [gigId]);

  const checkIfReviewed = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('id')
        .eq('gig_id', gigId)
        .eq('reviewer_id', userId)
        .single();

      if (data) setHasReviewed(true);
    } catch {
      setHasReviewed(false);
    }
  }, [gigId, userId]);

  useEffect(() => {
    fetchReviews();
    checkIfReviewed();
  }, [fetchReviews, checkIfReviewed]);

  

  const submitReview = async () => {
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          gig_id: gigId,
          reviewer_id: userId,
          reviewee_id: targetUserId,
          rating,
          comment: comment.trim()
        });

      if (error) throw error;

      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
      
      setRating(0);
      setComment('');
      setHasReviewed(true);
      fetchReviews();
      onReviewSubmitted?.();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
          interactive ? 'cursor-pointer hover:text-yellow-400' : ''
        }`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews & Ratings</span>
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Submit Review Form */}
      {!hasReviewed && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {renderStars(rating, true)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comment (optional)</label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button onClick={submitReview} disabled={submitting || rating === 0}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.reviewer_avatar} />
                  <AvatarFallback>
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{review.reviewer_name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reviews.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No reviews yet. Be the first to leave a review!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewRatingSystem;
