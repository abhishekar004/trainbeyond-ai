
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dumbbell, Plus, Calendar, Clock, Filter, ListFilter } from 'lucide-react';
import Header from '@/components/Header';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const workoutPlans = [
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Build muscle and increase strength with our comprehensive program.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 4,
    duration: '8 weeks',
    level: 'Intermediate'
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    description: 'Effective cardio and strength workouts designed for fat loss.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 5,
    duration: '12 weeks',
    level: 'Beginner'
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    description: 'Improve mobility and reduce injury risk with targeted stretching.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop',
    workoutsPerWeek: 3,
    duration: '6 weeks',
    level: 'All Levels'
  },
  {
    id: 'hiit',
    name: 'HIIT Training',
    description: 'High-intensity interval training for maximum calorie burn in minimum time.',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1474&auto=format&fit=crop',
    workoutsPerWeek: 4,
    duration: '6 weeks',
    level: 'Intermediate'
  }
];

const Workouts = () => {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof workoutPlans[0] | null>(null);
  const [userWorkouts, setUserWorkouts] = useState<any[]>([]);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [activeView, setActiveView] = useState<'all' | 'my'>('all');

  useEffect(() => {
    if (user) {
      fetchUserWorkouts();
    } else {
      setUserWorkouts([]);
      setLoadingWorkouts(false);
    }
  }, [user]);

  const fetchUserWorkouts = async () => {
    if (!user) return;
    
    try {
      setLoadingWorkouts(true);
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserWorkouts(data || []);
    } catch (error: any) {
      toast.error(`Error fetching workouts: ${error.message}`);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  const handleCreateWorkout = async () => {
    if (!user) {
      toast.error('Please sign in to create a workout');
      return;
    }

    if (!newWorkout.name.trim()) {
      toast.error('Please enter a workout name');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            name: newWorkout.name,
            description: newWorkout.description,
            user_id: user.id
          }
        ])
        .select();

      if (error) throw error;
      
      toast.success('Workout created successfully!');
      setUserWorkouts([...(data || []), ...userWorkouts]);
      setShowCreateDialog(false);
      setNewWorkout({ name: '', description: '' });
    } catch (error: any) {
      toast.error(`Error creating workout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !selectedPlan) {
      toast.error('Please sign in to save this plan');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            name: selectedPlan.name,
            description: selectedPlan.description,
            user_id: user.id
          }
        ])
        .select();

      if (error) throw error;
      
      toast.success(`${selectedPlan.name} plan saved to your workouts!`);
      setUserWorkouts([...(data || []), ...userWorkouts]);
      setShowPlanDialog(false);
    } catch (error: any) {
      toast.error(`Error saving plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const viewPlan = (plan: typeof workoutPlans[0]) => {
    setSelectedPlan(plan);
    setShowPlanDialog(true);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Workout Programs</h1>
            <p className="text-muted-foreground">Discover and save workout plans or create your own</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'all' | 'my')} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Programs</TabsTrigger>
                <TabsTrigger value="my">My Workouts</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {activeView === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {plan.workoutsPerWeek}x/week
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {plan.duration}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Dumbbell className="h-4 w-4 mr-1" />
                      {plan.level}
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => viewPlan(plan)}>
                    View Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeView === 'my' && (
          <>
            {loadingWorkouts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : userWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userWorkouts.map((workout) => (
                  <Card key={workout.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2" />
                        {workout.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{workout.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(workout.created_at).toLocaleDateString()}
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-2">No workouts yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your own custom workout or save a program to get started on your fitness journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workout
                  </Button>
                  <Button variant="outline" onClick={() => setActiveView('all')}>
                    Browse Programs
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Workout Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>
                Add a new workout to your personal collection.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input 
                  id="workout-name" 
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>
              
              <div>
                <Label htmlFor="workout-description">Description</Label>
                <Textarea 
                  id="workout-description"
                  value={newWorkout.description}
                  onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                  placeholder="Describe your workout..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateWorkout} disabled={loading}>
                {loading ? 'Creating...' : 'Create Workout'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Plan Dialog */}
        <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedPlan && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedPlan.name}</DialogTitle>
                  <DialogDescription>
                    {selectedPlan.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <img 
                      src={selectedPlan.imageUrl} 
                      alt={selectedPlan.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Calendar className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">{selectedPlan.workoutsPerWeek}x/week</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Clock className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">{selectedPlan.duration}</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Dumbbell className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">{selectedPlan.level}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Weekly Schedule</h3>
                    <ul className="space-y-2 text-sm">
                      {selectedPlan.id === 'strength' && (
                        <>
                          <li>Monday: Upper Body</li>
                          <li>Tuesday: Rest</li>
                          <li>Wednesday: Lower Body</li>
                          <li>Thursday: Rest</li>
                          <li>Friday: Full Body</li>
                          <li>Saturday: Active Recovery</li>
                          <li>Sunday: Rest</li>
                        </>
                      )}
                      {selectedPlan.id === 'weight-loss' && (
                        <>
                          <li>Monday: HIIT Cardio</li>
                          <li>Tuesday: Upper Body</li>
                          <li>Wednesday: HIIT Cardio</li>
                          <li>Thursday: Lower Body</li>
                          <li>Friday: HIIT Cardio</li>
                          <li>Saturday: Rest</li>
                          <li>Sunday: Active Recovery</li>
                        </>
                      )}
                      {selectedPlan.id === 'flexibility' && (
                        <>
                          <li>Monday: Upper Body Mobility</li>
                          <li>Tuesday: Rest</li>
                          <li>Wednesday: Lower Body Mobility</li>
                          <li>Thursday: Rest</li>
                          <li>Friday: Full Body Stretching</li>
                          <li>Saturday: Rest</li>
                          <li>Sunday: Rest</li>
                        </>
                      )}
                      {selectedPlan.id === 'hiit' && (
                        <>
                          <li>Monday: HIIT + Upper Body</li>
                          <li>Tuesday: Rest</li>
                          <li>Wednesday: HIIT + Lower Body</li>
                          <li>Thursday: Rest</li>
                          <li>Friday: HIIT + Core</li>
                          <li>Saturday: Active Recovery</li>
                          <li>Sunday: Rest</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPlanDialog(false)}>Close</Button>
                  <Button onClick={handleSavePlan} disabled={loading || !user}>
                    {loading ? 'Saving...' : 'Save to My Workouts'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Workouts;
