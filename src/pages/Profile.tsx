
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User, Edit, Dumbbell, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  fitness_level: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);

        // Fetch user's workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (workoutsError) throw workoutsError;
        setWorkouts(workoutsData || []);
      } catch (error: any) {
        toast.error(`Error fetching profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                <AvatarFallback className="text-2xl">
                  {profile?.username?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center">{profile?.username || profile?.full_name || user.email}</CardTitle>
            <CardDescription className="text-center">
              {profile?.fitness_level ? `Fitness Level: ${profile.fitness_level}` : 'Fitness enthusiast'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Workouts: {workouts.length}</span>
              </div>
              <Separator className="my-4" />
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>Track your workouts and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="workouts">
              <TabsList className="mb-4">
                <TabsTrigger value="workouts">Your Workouts</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="workouts">
                {workouts.length > 0 ? (
                  <div className="space-y-4">
                    {workouts.map((workout) => (
                      <Card key={workout.id}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-lg flex items-center">
                            <Dumbbell className="h-5 w-5 mr-2" />
                            {workout.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(workout.created_at).toLocaleDateString()}
                            </div>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No workouts yet</h3>
                    <p className="text-muted-foreground mb-4">Start creating your workout plans to track your fitness journey.</p>
                    <Button>Create Workout</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Progress tracking coming soon</h3>
                  <p className="text-muted-foreground">We're working on new features to help you track your fitness progress.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
