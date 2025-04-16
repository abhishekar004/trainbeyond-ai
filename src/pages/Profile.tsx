import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '../components/ui/use-toast';
import { User, Edit, Dumbbell, Calendar, Trash2, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';
import { Database } from "../types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Workout = Database["public"]["Tables"]["workouts"]["Row"];

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
};

interface ProfileFormData {
  username: string;
  full_name: string;
  fitness_level: string;
  weight: string;
  height: string;
  age: string;
  avatar_url: string;
}

interface WeightLog {
  id: string;
  weight: number;
  recorded_at: string;
  notes?: string;
}

interface WorkoutCompletion {
  id: string;
  workout_id: string;
  completed_at: string;
  duration_minutes: number;
  difficulty_rating: number;
  notes?: string;
  workout: {
    name: string;
  };
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState<ProfileFormData>({
    username: '',
    full_name: '',
    fitness_level: '',
    weight: '',
    height: '',
    age: '',
    avatar_url: ''
  });
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

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

      if (data) {
        setProfile(data);
        setEditForm({
          username: data.username || '',
          full_name: data.full_name || '',
          fitness_level: data.fitness_level || '',
          weight: data.weight?.toString() || '',
          height: data.height?.toString() || '',
          age: data.age?.toString() || '',
          avatar_url: data.avatar_url || ''
        });
      }

        // Fetch user's workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (workoutsError) throw workoutsError;
      
        setWorkouts(workoutsData || []);
      } catch (error: any) {
      toast({
        description: `Error fetching profile: ${error.message}`,
      });
      } finally {
        setLoading(false);
      }
    };

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username || null,
          full_name: editForm.full_name || null,
          fitness_level: editForm.fitness_level || null,
          weight: editForm.weight ? parseFloat(editForm.weight) : null,
          height: editForm.height ? parseFloat(editForm.height) : null,
          age: editForm.age ? parseInt(editForm.age) : null,
          avatar_url: editForm.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const updatedProfile: Profile = {
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          fitness_level: data.fitness_level,
          weight: data.weight,
          height: data.height,
          age: data.age,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        setProfile(updatedProfile);
        toast({
          description: "Your profile information has been saved.",
        });
        setShowEditDialog(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        description: "There was a problem saving your profile information.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Delete associated exercise logs first
      const { error: logsError } = await supabase
        .from('user_exercise_logs')
        .delete()
        .eq('workout_id', workoutId);

      if (logsError) throw logsError;

      // Then delete the workout
      const { error: workoutError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

      if (workoutError) throw workoutError;

      // Update local state
      setWorkouts((prev) => prev?.filter((w) => w.id !== workoutId));
      toast({
        description: "Workout deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        description: "Failed to delete workout",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const viewWorkoutDetails = async (workout: Workout) => {
    setSelectedWorkout(workout);
    setLoadingDetails(true);
    
    try {
      const { data: exercises, error } = await supabase
        .from('user_exercise_logs')
        .select(`
          id,
          sets,
          reps,
          weight,
          duration,
          exercises (
            id,
            name,
            description
          )
        `)
        .eq('workout_id', workout.id);

      if (error) throw error;

      const formattedExercises: Exercise[] = exercises.map((log) => ({
        id: log.exercises.id,
        name: log.exercises.name,
        description: log.exercises.description,
        sets: log.sets,
        reps: log.reps,
        weight: log.weight,
        duration: log.duration,
      }));

      setWorkoutExercises(formattedExercises.map((exercise) => ({
        exercise: {
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
        },
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
      })));
    } catch (error) {
      console.error('Error fetching workout details:', error);
      toast({
        description: "Failed to load workout details",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
      setShowDetailsDialog(true);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingPhoto(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file.');
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image size should be less than 2MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Error uploading image. Please try again.');
      }

      if (!data?.path) {
        throw new Error('Upload failed. Please try again.');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      // Update the avatar_url in the editForm
      setEditForm(prev => ({ ...prev, avatar_url: publicUrl }));
      
      toast({
        description: 'Photo uploaded successfully',
      });
    } catch (error: any) {
      toast({
        description: `Error uploading photo: ${error.message}`,
      });
      console.error('Photo upload error:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

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
              <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                <AvatarFallback className="text-2xl">
                    {profile?.username?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              </div>
            </div>
            <CardTitle className="text-center">{profile?.username || profile?.full_name || user?.email}</CardTitle>
            <CardDescription className="text-center">
              {profile?.fitness_level ? `Fitness Level: ${profile.fitness_level}` : 'Fitness enthusiast'}
              {profile?.age && <div>Age: {profile.age} years</div>}
              {(profile?.weight || profile?.height) && (
                <div className="mt-1">
                  {profile.height && `${profile.height} cm`}
                  {profile.weight && profile.height && ' • '}
                  {profile.weight && `${profile.weight} kg`}
                </div>
              )}
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
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setShowEditDialog(true)}
              >
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
                          <CardTitle className="text-lg flex items-center justify-between">
                            <div className="flex items-center">
                            <Dumbbell className="h-5 w-5 mr-2" />
                            {workout.name}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteWorkout(workout.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(workout.created_at).toLocaleDateString()}
                            </div>
                            <Button size="sm" variant="outline" onClick={() => viewWorkoutDetails(workout)}>
                              View Details
                            </Button>
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
                    <Button onClick={() => window.location.href = '/workouts'}>Create Workout</Button>
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

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={editForm.avatar_url || ''} />
                  <AvatarFallback>
                    {editForm.username?.[0]?.toUpperCase() || editForm.full_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </div>
              {uploadingPhoto && (
                <div className="text-sm text-muted-foreground">
                  Uploading...
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="Enter your username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                placeholder="Enter your age"
                min="0"
                max="150"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                  placeholder="Enter weight"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                  placeholder="Enter height"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fitness_level">Fitness Level</Label>
              <Select
                value={editForm.fitness_level}
                onValueChange={(value) => setEditForm({ ...editForm, fitness_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProfileUpdate}
              disabled={updating || uploadingPhoto}
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workout Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>{selectedWorkout?.description}</DialogDescription>
          </DialogHeader>
          {loadingDetails ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : workoutExercises && workoutExercises.length > 0 ? (
            <div className="space-y-4">
              {workoutExercises.map((exercise) => (
                <div key={exercise.exercise.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{exercise.exercise.name}</h4>
                  <p className="text-sm text-muted-foreground">{exercise.exercise.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">Sets:</span>{" "}
                      <span className="text-sm">{exercise.sets}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Reps:</span>{" "}
                      <span className="text-sm">{exercise.reps}</span>
                    </div>
                    {exercise.weight && (
                      <div>
                        <span className="text-sm font-medium">Weight:</span>{" "}
                        <span className="text-sm">{exercise.weight}kg</span>
                      </div>
                    )}
                    {exercise.duration && (
                      <div>
                        <span className="text-sm font-medium">Duration:</span>{" "}
                        <span className="text-sm">{exercise.duration}s</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No exercises found for this workout.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
