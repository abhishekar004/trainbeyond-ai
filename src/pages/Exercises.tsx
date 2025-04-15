
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  name: string;
  description: string;
  body_part: string;
  equipment: string;
  difficulty_level: string;
  image_url: string;
}

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*');

        if (error) throw error;
        setExercises(data || []);
      } catch (error: any) {
        toast.error('Error loading exercises');
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exercise Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {exercise.name}
                <span className="text-sm font-normal px-2 py-1 bg-primary/10 rounded-full">
                  {exercise.difficulty_level}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{exercise.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                  {exercise.body_part}
                </span>
                <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                  {exercise.equipment}
                </span>
              </div>
              <Button className="w-full mt-4">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
