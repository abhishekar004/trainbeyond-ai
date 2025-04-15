
import React from 'react';

const Exercises = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exercise Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Push-ups', 'Squats', 'Deadlifts', 'Pull-ups', 'Planks', 'Lunges'].map((exercise) => (
          <div key={exercise} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{exercise}</h3>
            <p className="text-gray-600 mb-4">
              Detailed instructions and proper form guidance for {exercise.toLowerCase()}.
            </p>
            <button className="text-primary hover:text-primary/90">
              Learn more →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
