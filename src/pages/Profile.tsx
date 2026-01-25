import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Phone, Mail, Edit, Save, UploadCloud, ShieldCheck, UserCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { NavigationHeader } from '@/components/NavigationHeader';
import { LocalizedInput } from '@/components/LocalizedInput';
import { useLocation } from '@/contexts/LocationContext';
import { useLiveData } from '@/components/LiveDataProvider';
import { FirebaseService } from '@/services/firebaseService';
import { supabase } from '@/lib/supabase';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { country } = useLocation();
  const { user } = useLiveData();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const initialRole: 'worker' | 'client' | 'organisation' =
    user?.role === 'admin' ? 'organisation' : (user?.role === 'client' ? 'client' : 'worker');
  const [role, setRole] = useState<'worker' | 'client' | 'organisation'>(initialRole);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: user?.full_name || 'Your Name',
    email: user?.email || '',
    phone: user?.phone || '',
    nationalId: '',
    location: country.name,
    bio: '',
    skills: ['Cleaning', 'Delivery', 'Customer Service'],
    rating: 4.8,
    completedGigs: 0,
    earnings: 0
  });

  const handleSave = () => {
    if (!user) {
      toast({ title: 'Sign In Required', description: 'Please sign in to update your profile', variant: 'destructive' });
      return;
    }
    setSaving(true);
    (async () => {
      try {
        let idUrl: string | undefined;
        let photoUrl: string | undefined;
        if (idFile) {
          idUrl = await FirebaseService.uploadFile(idFile, `ids/${user.id}/${Date.now()}_${idFile.name}`);
        }
        if (photoFile) {
          photoUrl = await FirebaseService.uploadFile(photoFile, `avatars/${user.id}/${Date.now()}_${photoFile.name}`);
        }
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            email: profile.email,
            full_name: profile.name,
            phone: profile.phone,
            country: country.name,
            role,
            national_id: profile.nationalId,
            location: profile.location,
            bio: profile.bio,
            avatar_url: photoUrl,
            id_document_url: idUrl,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        if (profileError) throw profileError;
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            full_name: profile.name,
            avatar_url: photoUrl,
            country: country.name,
            role
          }
        });
        if (authError) throw authError;
        setIsEditing(false);
        toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Could not update profile';
        toast({ title: 'Update Failed', description: msg, variant: 'destructive' });
      } finally {
        setSaving(false);
      }
    })();
  };

  const recentGigs = [
    { id: '1', title: 'House Cleaning', client: 'John Doe', amount: 35000, rating: 5, date: '2024-01-15' },
    { id: '2', title: 'Package Delivery', client: 'Jane Smith', amount: 25000, rating: 4, date: '2024-01-14' },
    { id: '3', title: 'Office Cleaning', client: 'ABC Corp', amount: 45000, rating: 5, date: '2024-01-13' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        title="Profile"
        showBack={true}
        showHome={true}
      />

      <div className="container mx-auto p-3 lg:p-6 space-y-4 lg:space-y-6">
        <div className="hidden lg:flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xl lg:text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {isEditing ? (
                  <div className="space-y-4">
                    <LocalizedInput
                      type="text"
                      label="Full Name"
                      value={profile.name}
                      onChange={(value) => setProfile({...profile, name: value})}
                      required
                    />
                    <LocalizedInput
                      type="text"
                      label="Email"
                      value={profile.email}
                      onChange={(value) => setProfile({...profile, email: value})}
                      required
                    />
                    <LocalizedInput
                      type="phone"
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(value) => setProfile({...profile, phone: value})}
                      required
                    />
                    <LocalizedInput
                      type="nationalId"
                      label="National ID"
                      value={profile.nationalId}
                      onChange={(value) => setProfile({...profile, nationalId: value})}
                      required
                    />
                    <LocalizedInput
                      type="text"
                      label="Location"
                      value={profile.location}
                      onChange={(value) => setProfile({...profile, location: value})}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-lg lg:text-xl">{profile.name}</CardTitle>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{profile.rating}</span>
                      <span className="text-muted-foreground text-sm">({profile.completedGigs} gigs)</span>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea 
                      value={profile.bio} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="stats" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stats" className="text-xs lg:text-sm">Statistics</TabsTrigger>
                <TabsTrigger value="history" className="text-xs lg:text-sm">Gig History</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs lg:text-sm">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 lg:p-6 text-center">
                      <div className="text-xl lg:text-2xl font-bold text-blue-600">{profile.completedGigs}</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">Completed Gigs</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 lg:p-6 text-center">
                      <div className="text-xl lg:text-2xl font-bold text-green-600">{profile.earnings.toLocaleString()} {country.currency}</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">Total Earnings</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 lg:p-6 text-center">
                      <div className="text-xl lg:text-2xl font-bold text-yellow-600">{profile.rating}</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">Average Rating</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 lg:p-6">
                      <div className="space-y-3">
                        <Label>Role</Label>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Button variant={role === 'worker' ? 'default' : 'outline'} onClick={() => setRole('worker')}>
                              <UserCheck className="w-4 h-4 mr-2" />Worker
                            </Button>
                            <Button variant={role === 'client' ? 'default' : 'outline'} onClick={() => setRole('client')}>
                              <UserCheck className="w-4 h-4 mr-2" />Provider
                            </Button>
                            <Button variant={role === 'organisation' ? 'default' : 'outline'} onClick={() => setRole('organisation')}>
                              <UserCheck className="w-4 h-4 mr-2" />Organisation
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs capitalize">{role}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 lg:p-6">
                      <div className="space-y-3">
                        <Label>Upload National ID</Label>
                        <div className="flex items-center gap-2">
                          <Input ref={idInputRef} type="file" accept="image/*,.pdf" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                          <Button variant="outline" onClick={() => idInputRef.current?.click()}>
                            <UploadCloud className="w-4 h-4 mr-2" />Browse
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Soft verification enabled. Admin may review if required.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 lg:p-6">
                      <div className="space-y-3">
                        <Label>Upload Profile Photo</Label>
                        <div className="flex items-center gap-2">
                          <Input ref={photoInputRef} type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                          <Button variant="outline" onClick={() => photoInputRef.current?.click()}>
                            <UploadCloud className="w-4 h-4 mr-2" />Browse
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {isEditing && (
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Profile & Verification'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                {recentGigs.map((gig) => (
                  <Card key={gig.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm lg:text-base">{gig.title}</h3>
                          <p className="text-xs lg:text-sm text-muted-foreground">Client: {gig.client}</p>
                          <p className="text-xs lg:text-sm text-muted-foreground">Date: {gig.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm lg:text-base">{gig.amount.toLocaleString()} {country.currency}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < gig.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4">
                {[
                  { client: 'John Doe', rating: 5, comment: 'Excellent cleaning service! Very thorough and professional.', date: '2024-01-15' },
                  { client: 'Jane Smith', rating: 4, comment: 'Good delivery service, arrived on time.', date: '2024-01-14' },
                  { client: 'ABC Corp', rating: 5, comment: 'Outstanding work! Will definitely hire again.', date: '2024-01-13' }
                ].map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-sm lg:text-base">{review.client}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
