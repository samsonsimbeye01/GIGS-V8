import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  location: string;
  country: string;
  status: 'open' | 'assigned' | 'in_progress' | 'paused' | 'completed' | 'paid' | 'disputed' | 'cancelled';
  client_id: string;
  worker_id?: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  skills_required?: string[];
  latitude?: number;
  longitude?: number;
  duration?: string;
  policy_compliant?: boolean;
  content_moderated?: boolean;
  provider_confirmed?: boolean;
  worker_confirmed?: boolean;
  status_reason?: string | null;
}

export interface GigApplication {
  id: string;
  gig_id: string;
  worker_id: string;
  message: string;
  proposed_budget: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

class GigService {
  async createGig(gigData: Partial<Gig>): Promise<{ gig: Gig | null; error: PostgrestError | string | null }> {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .insert({
          ...gigData,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) return { gig: null, error };
      return { gig: data, error: null };
    } catch (error: unknown) {
      return { gig: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getGigs(filters?: { country?: string; category?: string; status?: string }): Promise<{ gigs: Gig[]; error: PostgrestError | string | null }> {
    try {
      let query = supabase.from('gigs').select('*');
      
      if (filters?.country) {
        query = query.eq('country', filters.country);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) return { gigs: [], error };
      return { gigs: data || [], error: null };
    } catch (error: unknown) {
      return { gigs: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateGigStatus(gigId: string, status: Gig['status'], workerId?: string, statusReason?: string | null): Promise<{ error: PostgrestError | string | null }> {
    try {
      const updateData: Partial<Gig> = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (workerId) {
        updateData.worker_id = workerId;
      }
      if (typeof statusReason !== 'undefined') {
        updateData.status_reason = statusReason ?? null;
      }

      const { error } = await supabase
        .from('gigs')
        .update(updateData)
        .eq('id', gigId);

      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async applyToGig(gigId: string, workerId: string, message: string, proposedBudget: number): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { error } = await supabase
        .from('gig_applications')
        .insert({
          gig_id: gigId,
          worker_id: workerId,
          message,
          proposed_budget: proposedBudget,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getApplications(gigId: string): Promise<{ applications: GigApplication[]; error: PostgrestError | string | null }> {
    try {
      const { data, error } = await supabase
        .from('gig_applications')
        .select('*')
        .eq('gig_id', gigId)
        .order('created_at', { ascending: false });
      if (error) return { applications: [], error };
      return { applications: data || [], error: null };
    } catch (error: unknown) {
      return { applications: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getApplicationsCountForGigs(gigIds: string[]): Promise<{ counts: Record<string, number>; error: PostgrestError | string | null }> {
    try {
      if (gigIds.length === 0) {
        return { counts: {}, error: null };
      }
      const { data, error } = await supabase
        .from('gig_applications')
        .select('gig_id')
        .in('gig_id', gigIds);
      if (error) return { counts: {}, error };
      const counts: Record<string, number> = {};
      (data || []).forEach((row: { gig_id: string }) => {
        counts[row.gig_id] = (counts[row.gig_id] || 0) + 1;
      });
      gigIds.forEach((id) => {
        if (typeof counts[id] === 'undefined') counts[id] = 0;
      });
      return { counts, error: null };
    } catch (error: unknown) {
      return { counts: {}, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserNamesForIds(userIds: string[]): Promise<{ names: Record<string, string>; error: PostgrestError | string | null }> {
    try {
      if (userIds.length === 0) {
        return { names: {}, error: null };
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .in('id', userIds);
      if (error) return { names: {}, error };
      const names: Record<string, string> = {};
      (data || []).forEach((row: { id: string; full_name?: string }) => {
        names[row.id] = row.full_name || 'Client';
      });
      userIds.forEach((id) => {
        if (!names[id]) names[id] = 'Client';
      });
      return { names, error: null };
    } catch (error: unknown) {
      return { names: {}, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserBasicProfiles(userIds: string[]): Promise<{ profiles: Record<string, { name: string; avatar?: string }>; error: PostgrestError | string | null }> {
    try {
      if (userIds.length === 0) {
        return { profiles: {}, error: null };
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
      if (error) return { profiles: {}, error };
      const profiles: Record<string, { name: string; avatar?: string }> = {};
      (data || []).forEach((row: { id: string; full_name?: string; avatar_url?: string }) => {
        profiles[row.id] = { name: row.full_name || 'Client', avatar: row.avatar_url || undefined };
      });
      userIds.forEach((id) => {
        if (!profiles[id]) profiles[id] = { name: 'Client', avatar: undefined };
      });
      return { profiles, error: null };
    } catch (error: unknown) {
      return { profiles: {}, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async acceptApplication(appId: string): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { data: application, error: appError } = await supabase
        .from('gig_applications')
        .update({ status: 'accepted' })
        .eq('id', appId)
        .select()
        .single();
      if (appError) return { error: appError };
      const { error: gigError } = await supabase
        .from('gigs')
        .update({
          status: 'assigned',
          worker_id: application.worker_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.gig_id)
        .eq('status', 'open');
      return { error: gigError };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async lockJob(gigId: string): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', gigId)
        .eq('status', 'assigned');
      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async rejectApplication(appId: string): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { error } = await supabase
        .from('gig_applications')
        .update({ status: 'rejected' })
        .eq('id', appId);
      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async confirmCompletion(gigId: string, who: 'provider' | 'worker'): Promise<{ error: PostgrestError | string | null; completed: boolean }> {
    try {
      const updates: Partial<Gig> = { updated_at: new Date().toISOString() };
      if (who === 'provider') updates.provider_confirmed = true;
      if (who === 'worker') updates.worker_confirmed = true;
      const { data, error } = await supabase
        .from('gigs')
        .update(updates)
        .eq('id', gigId)
        .select()
        .single();
      if (error) return { error, completed: false };
      const bothConfirmed = !!(data.provider_confirmed && data.worker_confirmed);
      if (bothConfirmed) {
        await supabase
          .from('gigs')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', gigId);
      }
      return { error: null, completed: bothConfirmed };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error', completed: false };
    }
  }

  async triggerPayment(gigId: string): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { data: gig, error: gigError } = await supabase
        .from('gigs')
        .select('id,budget,client_id,worker_id,status')
        .eq('id', gigId)
        .single();
      if (gigError) return { error: gigError };
      if (gig.status !== 'completed') return { error: 'Gig must be completed to trigger payment' };
      if (!gig.worker_id) return { error: 'No worker assigned to gig' };
      const { error } = await supabase
        .from('payments')
        .insert({
          jobId: gigId,
          amount: gig.budget,
          payer: gig.client_id,
          payee: gig.worker_id,
          status: 'pending',
          created_at: new Date().toISOString()
        });
      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createPaymentRecord(gigId: string, amount: number, payerId: string, payeeId: string): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          jobId: gigId,
          amount,
          payer: payerId,
          payee: payeeId,
          status: 'pending',
          created_at: new Date().toISOString()
        });
      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async submitRating(gigId: string, reviewerId: string, revieweeId: string, rating: number, comment?: string): Promise<{ error: PostgrestError | string | null }> {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          gig_id: gigId,
          reviewer_id: reviewerId,
          reviewee_id: revieweeId,
          rating,
          comment: (comment || '').trim()
        });
      return { error };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getPaymentByJobId(gigId: string): Promise<{ payment: { id: string; status: string } | null; error: PostgrestError | string | null }> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('id,status')
        .eq('jobId', gigId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return { payment: null, error };
      return { payment: data || null, error: null };
    } catch (error: unknown) {
      return { payment: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getPaymentsForJobs(gigIds: string[]): Promise<{ payments: Record<string, string>; error: PostgrestError | string | null }> {
    try {
      if (gigIds.length === 0) return { payments: {}, error: null };
      const { data, error } = await supabase
        .from('payments')
        .select('jobId,status,created_at')
        .in('jobId', gigIds);
      if (error) return { payments: {}, error };
      const latest: Record<string, { status: string; created_at: string }> = {};
      (data || []).forEach((row: { jobId: string; status: string; created_at: string }) => {
        const prev = latest[row.jobId];
        if (!prev || new Date(row.created_at).getTime() > new Date(prev.created_at).getTime()) {
          latest[row.jobId] = { status: row.status, created_at: row.created_at };
        }
      });
      const payments: Record<string, string> = {};
      Object.entries(latest).forEach(([jobId, info]) => {
        payments[jobId] = info.status;
      });
      return { payments, error: null };
    } catch (error: unknown) {
      return { payments: {}, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const gigService = new GigService();
