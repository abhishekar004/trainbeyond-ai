
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Exercise } from '@/types/exercise';
import ExerciseDetails from '@/components/ExerciseDetails';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bodyPartFilter, setBodyPartFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  const uniqueBodyParts = [...new Set(exercises.map(ex => ex.body_part))];
  const uniqueDifficulties = [...new Set(exercises.map(ex => ex.difficulty_level))];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
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

  const handleViewDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBodyPart = bodyPartFilter === '' || exercise.body_part === bodyPartFilter;
    const matchesDifficulty = difficultyFilter === '' || exercise.difficulty_level === difficultyFilter;
    
    return matchesSearch && matchesBodyPart && matchesDifficulty;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Exercise Library</h1>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={bodyPartFilter} onValueChange={setBodyPartFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Body Part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Body Parts</SelectItem>
                {uniqueBodyParts.map(part => (
                  <SelectItem key={part} value={part}>{part}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Difficulties</SelectItem>
                {uniqueDifficulties.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
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
                <p className="text-muted-foreground mb-4 line-clamp-2">{exercise.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                    {exercise.body_part}
                  </span>
                  {exercise.equipment && (
                    <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                      {exercise.equipment}
                    </span>
                  )}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleViewDetails(exercise)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No exercises found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
        
        <ExerciseDetails 
          exercise={selectedExercise} 
          isOpen={showDetails} 
          onClose={handleCloseDetails} 
        />
      </div>
    </>
  );
};

export default Exercises;
