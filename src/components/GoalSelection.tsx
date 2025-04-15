
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Flame, Heart } from "lucide-react";

interface GoalSelectionProps {
  onSelectGoal: (goal: string) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onSelectGoal }) => {
  const goals = [
    {
      id: 'weight-loss',
      title: 'Weight/Fat Loss',
      description: 'Burn calories and reduce body fat percentage',
      icon: <Flame className="h-8 w-8 text-red-500" />,
      color: 'bg-red-50 hover:bg-red-100'
    },
    {
      id: 'muscle-gain',
      title: 'Muscle Gain',
      description: 'Build muscle mass and increase strength',
      icon: <Dumbbell className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'general-fitness',
      title: 'General Fitness',
      description: 'Improve overall health and conditioning',
      icon: <Heart className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50 hover:bg-green-100'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-2">What's Your Fitness Goal?</h2>
      <p className="text-center text-muted-foreground mb-8">Select your primary fitness goal to get started</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card 
            key={goal.id} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg fitness-card-shadow ${goal.color}`}
            onClick={() => onSelectGoal(goal.id)}
          >
            <CardHeader className="flex flex-col items-center">
              <div className="p-3 rounded-full mb-4">
                {goal.icon}
              </div>
              <CardTitle>{goal.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>{goal.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <Button variant="outline">Select This Goal</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalSelection;
