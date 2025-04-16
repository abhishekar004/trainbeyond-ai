import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Activity, TrendingUp, Calendar, Timer, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Progress = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    recentCompletions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressStats();
    }
  }, [user]);

  const fetchProgressStats = async () => {
    try {
      setLoading(true);

      // Get total completed workouts
      const { data: workoutCompletions, error: workoutError } = await supabase
        .from('workout_completions')
        .select('id, completed_at, duration_minutes, difficulty_rating, notes, workouts(name)')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (workoutError) throw workoutError;

      // Get total exercises completed
      const { data: exerciseProgress, error: exerciseError } = await supabase
        .from('exercise_progress')
        .select('id')
        .eq('user_id', user.id);

      if (exerciseError) throw exerciseError;

      setStats({
        totalWorkouts: workoutCompletions?.length || 0,
        totalExercises: exerciseProgress?.length || 0,
        recentCompletions: workoutCompletions || []
      });
    } catch (error) {
      console.error('Error fetching progress stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your progress</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your fitness journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Workout Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              Workouts completed
            </p>
          </CardContent>
        </Card>

        {/* Exercise Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <p className="text-xs text-muted-foreground">
              Exercises performed
            </p>
          </CardContent>
        </Card>

        {/* Progress Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Metrics</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Track your improvements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workout Completions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[100px]">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : stats.recentCompletions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentCompletions.map((completion: any) => (
                  <div key={completion.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-semibold">{completion.workouts?.name || 'Unnamed Workout'}</h4>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(completion.completed_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Timer className="h-4 w-4 mr-1" />
                            {completion.duration_minutes} mins
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {completion.difficulty_rating}/5
                          </span>
                        </div>
                        {completion.notes && (
                          <p className="mt-2 text-sm">{completion.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No completed workouts yet. Start working out to track your progress!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Future Progress Charts Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Progress Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Progress tracking charts and analytics coming soon!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress; 