import React, { useState, useEffect } from 'react';
import { ManadaLiveEvent } from './ManadaLiveEvent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLiveData } from './LiveDataProvider';
import { mnadaService } from '@/services/mnadaService';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface ManadaEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  currentParticipants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  location: string;
  category: string;
  featuredImage?: string;
}

export const ManadaEventsList: React.FC = () => {
  const [events, setEvents] = useState<ManadaEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showHostDialog, setShowHostDialog] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    location: '',
    start: '',
    end: '',
    capacity: 50
  });
  const { user } = useLiveData();

  useEffect(() => {
    (async () => {
      const { data } = await mnadaService.listAuctions();
      const normalized: ManadaEvent[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        startTime: row.start_time,
        endTime: row.end_time,
        currentParticipants: row.current_participants || 0,
        maxParticipants: row.capacity,
        status: row.status === 'live' ? 'live' : (new Date(row.start_time).getTime() > Date.now() ? 'scheduled' : 'ended'),
        location: row.location || '',
        category: row.category || 'General'
      }));
      setEvents(normalized);
    })();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('mnada_attendance_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mnada_attendance' },
        async (payload) => {
          const auctionId =
            (payload.new as any)?.auction_id ??
            (payload.old as any)?.auction_id;
          if (!auctionId) return;
          const { data, error } = await supabase
            .from('mnada_attendance')
            .select('id', { count: 'exact' })
            .eq('auction_id', auctionId);
          if (error) return;
          const count = (data as any)?.length ?? 0;
          setEvents((prev) =>
            prev.map((e) =>
              e.id === auctionId
                ? { ...e, currentParticipants: count }
                : e
            )
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({ title: 'Sign In Required', description: 'Please sign in to join live' });
      return;
    }
    const { error } = await mnadaService.joinAuction(eventId, user.id);
    if (error) {
      toast({ title: 'Join Failed', description: String(error), variant: 'destructive' });
    } else {
      toast({ title: 'Joined', description: 'You have joined the live event' });
    }
  };

  const handleReminder = async (eventId: string) => {
    if (!user) {
      toast({ title: 'Sign In Required', description: 'Please sign in to set a reminder' });
      return;
    }
    const { error } = await mnadaService.setReminder(eventId, user.id);
    if (error) {
      toast({ title: 'Reminder Failed', description: String(error), variant: 'destructive' });
    } else {
      toast({ title: 'Reminder Set', description: 'We will notify you before it starts' });
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Manada Events</h2>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowHostDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Host Manada
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Fashion">Fashion</SelectItem>
            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
            <SelectItem value="Automotive">Automotive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="scheduled">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <ManadaLiveEvent
            key={event.id}
            event={event}
            onJoin={handleJoinEvent}
            onReminder={handleReminder}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No events found matching your criteria.</p>
        </div>
      )}

      <Dialog open={showHostDialog} onOpenChange={setShowHostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Host a Manada Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Time</Label>
                <Input type="datetime-local" value={form.start} onChange={(e) => setForm(prev => ({ ...prev, start: e.target.value }))} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="datetime-local" value={form.end} onChange={(e) => setForm(prev => ({ ...prev, end: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm(prev => ({ ...prev, capacity: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowHostDialog(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!user) {
                    toast({ title: 'Sign In Required', description: 'Please sign in to host' });
                    return;
                  }
                  const start = form.start ? new Date(form.start).toISOString() : new Date().toISOString();
                  const end = form.end ? new Date(form.end).toISOString() : new Date(Date.now() + 3600000).toISOString();
                  const { error } = await mnadaService.createAuction({
                    host_id: user.id,
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    start_time: start,
                    end_time: end,
                    capacity: form.capacity
                  });
                  if (error) {
                    toast({ title: 'Create Failed', description: String(error), variant: 'destructive' });
                  } else {
                    toast({ title: 'Created', description: 'Your event has been created' });
                    setShowHostDialog(false);
                  }
                }}
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
