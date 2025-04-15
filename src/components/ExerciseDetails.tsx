
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Dumbbell, Target, User, LucideIcon } from 'lucide-react';
import { Exercise } from '@/types/exercise';

interface ExerciseDetailsProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({ exercise, isOpen, onClose }) => {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{exercise.name}</DialogTitle>
          <DialogDescription className="flex items-center">
            <Badge variant="outline" className="mr-2">{exercise.body_part}</Badge>
            <Badge variant="outline" className="mr-2">{exercise.equipment || 'No equipment'}</Badge>
            <Badge variant="outline">{exercise.difficulty_level}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {exercise.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground text-sm">{exercise.description || 'No description available.'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
              <Dumbbell className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm font-medium">Equipment</span>
              <span className="text-xs text-muted-foreground">{exercise.equipment || 'Bodyweight'}</span>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
              <Target className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm font-medium">Target Muscle</span>
              <span className="text-xs text-muted-foreground">{exercise.body_part}</span>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Recommended</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="font-medium mr-2">Sets:</span> 3-4 sets
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Reps:</span> 8-12 reps
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Rest:</span> 60-90 seconds between sets
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>
              <PlayCircle className="h-4 w-4 mr-2" />
              Watch Tutorial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDetails;
