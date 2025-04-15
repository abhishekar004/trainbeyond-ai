
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle2, ExternalLink, PlayCircle } from "lucide-react";
import { 
  searchExercisesByBodyPart, 
  fetchExerciseVideos, 
  Exercise, 
  Video, 
  WorkoutPlan as WorkoutPlanType,
  getTargetMusclesByFocus 
} from '@/services/exerciseApi';

interface WorkoutPlanProps {
  plan: WorkoutPlanType;
  onBack: () => void;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan, onBack }) => {
  const [activeDay, setActiveDay] = useState("0");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // For demo purposes, we'll load exercises when a day is selected
  useEffect(() => {
    const loadExercises = async () => {
      setLoadingExercises(true);
      const dayIndex = parseInt(activeDay);
      // Add null check for plan and weeklySchedule
      if (!plan || !plan.weeklySchedule || !plan.weeklySchedule[dayIndex]) {
        setLoadingExercises(false);
        return;
      }
      
      const currentDay = plan.weeklySchedule[dayIndex];
      
      // Get body part to target based on the day's focus and goal
      const bodyPart = getTargetMusclesByFocus(currentDay.focus, plan.goal);
      
      try {
        console.log(`Loading exercises for ${currentDay.focus} (${bodyPart}) based on ${plan.goal} goal`);
        const exerciseData = await searchExercisesByBodyPart(bodyPart);
        // Limit to 4 exercises for demo purposes
        setExercises(exerciseData ? exerciseData.slice(0, 4) : []);
      } catch (error) {
        console.error('Error loading exercises:', error);
        setExercises([]);
      } finally {
        setLoadingExercises(false);
      }
    };
    
    loadExercises();
  }, [activeDay, plan]);
  
  // Load related videos when exercises are loaded
  useEffect(() => {
    const loadVideos = async () => {
      // Check if exercises exist before proceeding
      if (!exercises || exercises.length === 0) {
        setVideos([]);
        return;
      }
      
      setLoadingVideos(true);
      const dayIndex = parseInt(activeDay);
      
      // Add null check for plan and weeklySchedule
      if (!plan || !plan.weeklySchedule || !plan.weeklySchedule[dayIndex]) {
        setLoadingVideos(false);
        return;
      }
      
      const currentDay = plan.weeklySchedule[dayIndex];
      
      try {
        // Get videos related to the day's focus and goal
        const searchQuery = `${currentDay.focus} workout for ${plan.goal}`;
        console.log(`Searching videos for: ${searchQuery}`);
        const videoData = await fetchExerciseVideos(searchQuery);
        setVideos(videoData || []);
      } catch (error) {
        console.error('Error loading videos:', error);
        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };
    
    loadVideos();
  }, [exercises, activeDay, plan]);

  // Add null check for plan
  if (!plan || !plan.weeklySchedule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">Workout Plan</h2>
        </div>
        <div className="text-center py-8">
          <p>No workout plan data available. Please go back and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Your {plan.goal} Workout Plan</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.weeklySchedule.map((day, index) => (
                <Button
                  key={index}
                  variant={activeDay === index.toString() ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveDay(index.toString())}
                >
                  <div className="flex items-center">
                    <div className="w-16 font-medium">{day.day}</div>
                    <div>{day.focus}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Tips for Success:</h4>
              <ul className="space-y-2">
                {(plan.tips || []).map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {plan.weeklySchedule[parseInt(activeDay)]?.day} - {plan.weeklySchedule[parseInt(activeDay)]?.focus}
            </CardTitle>
            <CardDescription>
              Complete all exercises with proper form and adequate rest between sets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="exercises">
              <TabsList className="mb-4">
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="videos">Related Videos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="exercises">
                {loadingExercises ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse text-center">
                      <div className="h-4 bg-slate-200 rounded w-48 mb-2.5 mx-auto"></div>
                      <div className="h-4 bg-slate-200 rounded w-64 mb-2.5 mx-auto"></div>
                      <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
                    </div>
                  </div>
                ) : exercises && exercises.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exercises.map((exercise) => (
                      <Card key={exercise.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden bg-slate-100 flex justify-center items-center">
                          <img 
                            src={exercise.gifUrl} 
                            alt={exercise.name} 
                            className="h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg mb-1">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {exercise.bodyPart} | {exercise.equipment}
                          </p>
                          <div className="text-sm">
                            <p><span className="font-medium">Target:</span> {exercise.target}</p>
                            <p><span className="font-medium">Sets:</span> 3-4</p>
                            <p><span className="font-medium">Reps:</span> 8-12</p>
                            <p><span className="font-medium">Rest:</span> 60-90 seconds</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No exercises found for this day. Try selecting a different day.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="videos">
                {loadingVideos ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse text-center">
                      <div className="h-4 bg-slate-200 rounded w-48 mb-2.5 mx-auto"></div>
                      <div className="h-4 bg-slate-200 rounded w-64 mb-2.5 mx-auto"></div>
                      <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
                    </div>
                  </div>
                ) : videos && videos.length > 0 ? (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <Card key={video.id.videoId} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img 
                              src={video.snippet.thumbnails.high.url} 
                              alt={video.snippet.title} 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <CardContent className="p-4 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <h4 className="font-semibold text-lg mb-1">{video.snippet.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {video.snippet.channelTitle}
                              </p>
                            </div>
                            <div className="flex justify-end">
                              <a 
                                href={`https://www.youtube.com/watch?v=${video.id.videoId}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Button variant="outline" className="flex items-center">
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  Watch on YouTube
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No videos found for this workout. Try selecting a different day.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutPlan;
