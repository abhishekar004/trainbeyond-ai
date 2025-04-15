
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PlanOptionsProps {
  goal: string;
  onBack: () => void;
  onSubmit: (options: {
    level: string;
    equipment: string;
    frequency: string;
    preferences: string;
  }) => void;
}

const PlanOptions: React.FC<PlanOptionsProps> = ({ goal, onBack, onSubmit }) => {
  const [level, setLevel] = useState('beginner');
  const [equipment, setEquipment] = useState('minimal');
  const [frequency, setFrequency] = useState('3');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = () => {
    onSubmit({
      level,
      equipment,
      frequency,
      preferences
    });
  };

  const goalText = {
    'weight-loss': 'Weight/Fat Loss',
    'muscle-gain': 'Muscle Gain',
    'general-fitness': 'General Fitness'
  }[goal] || 'Custom Goal';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Customize Your {goalText} Plan</h2>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="level">Your Fitness Level</Label>
            <RadioGroup 
              id="level" 
              value={level} 
              onValueChange={setLevel}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="level-beginner" />
                <Label htmlFor="level-beginner">Beginner - New to working out</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="level-intermediate" />
                <Label htmlFor="level-intermediate">Intermediate - Some experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="level-advanced" />
                <Label htmlFor="level-advanced">Advanced - Consistent training experience</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipment">Available Equipment</Label>
            <RadioGroup 
              id="equipment" 
              value={equipment} 
              onValueChange={setEquipment}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="equipment-none" />
                <Label htmlFor="equipment-none">None - Bodyweight only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimal" id="equipment-minimal" />
                <Label htmlFor="equipment-minimal">Minimal - Dumbbells, resistance bands</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="equipment-full" />
                <Label htmlFor="equipment-full">Full Gym - Access to machines and equipment</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Weekly Workout Frequency</Label>
            <RadioGroup 
              id="frequency" 
              value={frequency} 
              onValueChange={setFrequency}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="frequency-2" />
                <Label htmlFor="frequency-2">2 days per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="frequency-3" />
                <Label htmlFor="frequency-3">3 days per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="frequency-4" />
                <Label htmlFor="frequency-4">4 days per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="frequency-5" />
                <Label htmlFor="frequency-5">5+ days per week</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferences">Preferences or Limitations (Optional)</Label>
            <Textarea 
              id="preferences" 
              placeholder="Example: 'I have lower back issues' or 'I prefer bodyweight exercises'" 
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="h-24"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit}>
            Generate Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanOptions;
